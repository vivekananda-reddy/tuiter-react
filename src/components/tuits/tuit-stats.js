import React, {useState} from "react";

import {findAllTuitsLikedByUser} from "../../services/likes-service";
import {findAllTuitsDislikedByUser} from "../../services/dislikes-service";

const TuitStats = ({tuit, likeTuit, dislikeTuit = () => {}}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    findAllTuitsLikedByUser("me").then(response => setIsLiked((response.filter(retrievedTuit => retrievedTuit._id === tuit._id)).length > 0));
    findAllTuitsDislikedByUser("me").then(response => setIsDisliked((response.filter(retrievedTuit => retrievedTuit._id === tuit._id)).length > 0));
    return (
      <div className="row mt-2">
        <div className="col">
          <i className="far fa-message me-1"></i>
          {tuit.stats && tuit.stats.replies}
        </div>
        <div className="col">
          <i className="far fa-retweet me-1"></i>
          {tuit.stats && tuit.stats.retuits}
        </div>
        <div className="col">
          <span onClick={() => likeTuit(tuit)}>
              {
                 isLiked === false && <i className="fa-regular fa-thumbs-up"></i>
              }
              {
                  isLiked === true && <i className="fa-solid fa-thumbs-up"></i>
              }
            {tuit.stats && tuit.stats.likes}
          </span>
        </div>
        <div className="col">
          <span onClick={() => dislikeTuit(tuit)}>
              {

                  isDisliked === false && <i className="fa-regular fa-thumbs-down"></i>
              }
              {
                  isDisliked === true && <i className="fa-solid fa-thumbs-down"></i>
              }
              {tuit.stats && tuit.stats.dislikes}
          </span>
        </div>
        <div className="col">
          <i className="far fa-inbox-out"></i>
        </div>
      </div>
    );
}
export default TuitStats;