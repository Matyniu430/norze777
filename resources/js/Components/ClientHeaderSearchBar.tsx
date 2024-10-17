import React, { useEffect, useRef, useState } from "react";
import closeIcon from '../../assets/close.svg';
import searchIcon from '../../assets/search.svg';
import { SearchProduct, SearchSuggestion } from "@/types";
import ClientHeaderSearchBarResults from "./ClientHeaderSearchBarResults";
import Loader from "./Loader";

interface Props {
    isSearching: boolean,
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
    toggleSearch: () => void
}

type SearchData = {
    searchValue: string,
    suggestions?: SearchSuggestion[],
    products?: SearchProduct[]
}

export default function ClientHeaderSearchBar({ isSearching, setIsSearching, toggleSearch }: Props) {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const isInitialRender = useRef(true);
    const debounceTimeout = useRef<number | undefined>(undefined);
    const [results, setResults] = useState<SearchData | null>(null);
    const [savedResults, setSavedResults] = useState<SearchData[]>([]);

    useEffect(() => {
        const addClickListener = () => {
            window.addEventListener('mousedown', disableSearchBarOnClick);
        };

        const removeClickListener = () => {
            window.removeEventListener('mousedown', disableSearchBarOnClick);
        };
        if (isSearching) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
                setIsFocused(true);
            }
            const timeoutId = setTimeout(addClickListener, 0);
            document.body.style.overflow = 'hidden';
            return () => {
                clearTimeout(timeoutId);
                removeClickListener();
                document.body.style.overflow = 'auto';
            };
        } else {
            removeClickListener();
            document.body.style.overflow = 'auto';
        }
    }, [isSearching]);

    const disableSearchBarOnClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        clearTimeout(debounceTimeout.current);
        setResults(null);
        debounceTimeout.current = setTimeout(async () => {
            if (searchValue !== '') {
                for (const searchRecord of savedResults) {
                    if (searchRecord.searchValue === searchValue) {
                        setResults(searchRecord);
                        return;
                    }
                }
            }
            const searchValueToSave = searchValue;
            await fetch(`http://127.0.0.1:8000/dynamic-search?value=${searchValue}`).then(async res => {
                if (res.status === 200) {
                    const data = await res.json() as SearchData;
                    setResults({
                        products: data.products,
                        suggestions: data.suggestions,
                        searchValue: searchValueToSave
                    });
                }
            });
        }, 500);

        return () => clearTimeout(debounceTimeout.current);
    }, [searchValue]);

    useEffect(() => {
        if (results) {
            const savedResultsArr = savedResults.map(r => r);
            if (!savedResultsArr.find(r => r.searchValue === results.searchValue)) {
                savedResultsArr.push(results);
                setSavedResults(savedResultsArr);
            }
        }
    }, [results]);
    return (
        <>
            <div ref={containerRef} className={`w-full bg-white flex items-center z-[999] justify-center px-24 max-tablet:pr-4 ease max-tablet:pl-4 h-[145px] absolute ${isSearching ? 'top-[-1px] opacity-1 pointer-events-auto duration-200' : 'top-[-20px] pointer-events-none opacity-0'}`}>
                <div className={`w-[100%] relative px-4 ${!isFocused ? 'search-box' : 'focused-search-box'} max-w-[742px] border border-gray-550 duration-100 h-[50px]`}>
                    <form className='flex relative'>
                        <input
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            autoComplete="off"
                            spellCheck="false"
                            autoCorrect="off"
                            value={searchValue}
                            onChange={(e) => { setSearchValue(e.target.value) }}
                            autoCapitalize="off"
                            className='appearance-none w-full z-10 h-[calc(50px-2px)] pt-[10px] border-none focus:ring-0 p-0'
                            id="search-input"
                            name="search-input"
                            ref={searchInputRef}
                        >
                        </input>
                        <label htmlFor='search-input' className={`${isFocused || searchInputRef.current?.value !== '' ? "focused-search-input-label" : 'search-input-label'}`}>
                            Szukaj
                        </label>
                        {searchValue !== '' ?
                            <button className="absolute z-40 right-[40px] top-1/2 -translate-y-1/2" onClick={(e) => {
                                e.preventDefault();
                                setSearchValue("");
                            }}>
                                <div className="relative w-full h-full reset-search">
                                    <div className="border border-gray rounded-full p-1">
                                        <img src={closeIcon} alt="reset search" width="10" height="10" />
                                    </div>
                                </div>
                            </button> : null
                        }
                        <button className="w-[15px]">
                            <img src={searchIcon} alt="search" width="15" height="15"/>
                        </button>
                    </form>
                    {searchValue !== '' && (isFocused || results) ?
                        <div className="top-[97.5px] left-[-1rem] border-b border-gray w-[100vw] tablet:w-[calc(100%+4px)] shadow-absolute tablet:border tablet:border-gray tablet:top-[50px] absolute border-t-0 max-h-[769.5px] overflow-y-auto tablet:left-[-2px] bg-white">
                            {results ?
                                <>
                                    {results.products ?
                                        <ClientHeaderSearchBarResults results={{
                                            type: "produkty",
                                            products: results.products
                                        }} /> : null
                                    }
                                    <div className={`px-4 text-sm py-2 hover:bg-gray-02 cursor-pointer ${(results?.products || results?.suggestions) ? "border-t border-gray" : ''}`}>
                                        <p>Szukaj "{searchValue}"</p>
                                    </div> </> : <Loader parentClass="mx-auto py-2" />
                            }
                        </div> : null}
                </div>
                <div className='w-[4.4rem] h-[4.4rem] flex max-tablet:justify-end justify-center items-center cursor-pointer' onClick={toggleSearch}>
                    <img src={closeIcon} alt="close" width="17" height="17" />
                </div>

            </div>
            {isSearching ?
                <div className={`fixed bg-black h-[100vh] w-full left-0 opacity-50 top-[145px]`}>
                </div> : null
            }
        </>
    )
}