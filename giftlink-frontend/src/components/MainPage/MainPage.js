import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';     //backend url 

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    //Get all gifts from backend
    const fetchGifts = async () => {
       try {
            let url = `${urlConfig.backendUrl}/api/gifts`;
            console.log("sending request to backend to get all gifts");
            const response = await fetch(url);

            if(!response.ok){
                throw new Error(`HTTP error; ${response.status}`)
            }

            const data = await response.json();
            console.log("loading gifts onto page: \n" + {data});
            setGifts(data);

       }catch(e){
        console.log("Fetch gifts error for MainPage:" + e.message);
       }     
    };

    //Set state values on mount
    useEffect(() => {
        console.log("Mounting main page");
        fetchGifts();
    }, []);

    // Navigate to template detail page for each gift
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
      };

   // Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("default", {month: "long", day:"numeric", year:"numeric"});
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">
                            {/* //------------ gift image ------------------------------------ */}
                            <div className='image-placeholder'>
                                {gift.image?(
                                    <img src={gift.image} alt={gift.name} className="card-img-top" />
                                ):(
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>
                                         
                            <div className="card-body">
                                {/* //------------ gift name ------------------------------------ */}
                                <h5 className='card-title'>{gift.name}</h5>
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                {/* // Task 6: Display gift image or placeholder */}
                                {/* // Write your code below this line */}
                                

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
