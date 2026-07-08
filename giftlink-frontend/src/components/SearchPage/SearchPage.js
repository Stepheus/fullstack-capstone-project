import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
import "./SearchPage.css";


function SearchPage() {


   //Search query state variables   
    const [searchQuery, setSearchQuery] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [searchResults, setSearchResults] = useState("");

    const categories = ['Living Room', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const categoryRef = useRef(null);   //to select category input
    const conditionRef = useRef(null); //to select condition input


    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                console.log(`Backend search url: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async ()=> {

        const baseUrl = `${urlConfig.backendUrl}/api/search?`;

        const queryParams = new URLSearchParams({
        name: searchQuery,
        age_years: ageRange,
        category: categoryRef.current.value,
        condition: conditionRef.current.value,
        }).toString();

        console.log({queryParams});

        try {
            const searchUrl = `${baseUrl}${queryParams}`;
            console.log("Search url: " + searchUrl);
            const searchResponse = await fetch(searchUrl);
            if (!searchResponse.ok){
                throw new Error(`HTTP search error; ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json();
            setSearchResults(searchData);

        }catch (error){
            console.error("Failed to fetch search results: " + error);
        }

    }


    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/:${productId}`);
    };




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">

                            {/*Category Select*/}
                            <label htmlFor='categorySelect'>Category</label>
                            <select ref={categoryRef} id="categorySelect" className='form-control my-1'>
                                <option value="">All</option>
                                {categories.map(category=> (
                                    <option key= {category} value={category} className='dropdown-filter'>{category}</option>
                                ))}

                            </select>

                            {/*Condition Select*/}
                             <label htmlFor='conditionSelect'>Condition</label>
                            <select ref={conditionRef} id="conditionSelect" className='form-control my-1'>
                                <option value="">All</option>
                                {conditions.map(condition => (
                                    <option key= {condition} value={condition}>{condition}</option>
                                ))}

                            </select>

                            {/*Range Slider */}
                            <label htmlFor="ageRange">Less than {ageRange} years </label>
                            <input type="range"
                                className='form-control-range age-range-slider'
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={(e)=> setAgeRange(e.target.value)}
                            />

                           

                        </div>
                    </div>
                    <div className='search-bar'>
                        <input type="text" 
                            placeholder='Search for items...'
                            className="form-control search-input"
                            id="query"
                            value={searchQuery}
                            onChange ={(e)=> setSearchQuery(e.target.value)}
                        />

                        {/* Trigger button search*/}
                        <button className='btn btn-primary search-button' onClick={handleSearch}>Search</button>

                    </div>
                 
                
                    {/* search Results*/}
                    <div className="search-results-card mt-4">
                        {searchResults.length > 0? (
                            searchResults.map(product => (
                                <div key={product.id} className="card mb-3">
                                    <img src={product.image} alt={product.name} className='card-img-top'/>
                                    <div className='card-body'>
                                        <h5 className='card-title'></h5>
                                        <p className='card-text'>{product.description.slice(0, 100)}...</p>
                                    </div>
                                    <div className='card-footer'>
                                        <button className="btn btn-primary " onClick={()=> goToDetailsPage(product.id)}>
                                        ViewMore</button>
                                    </div>
                                </div>
                            ))
                        ):(
                            <div className='alert alert-info product-not-found' role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
