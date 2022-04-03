import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const USERS_API = `${BASE_URL}/api/users`;
const TUITS_API = `${BASE_URL}/api/tuits`;

const api = axios.create({
                             withCredentials: true
                         });
/**
 * Finds all tuits disliked by user
 * @param userId Primary key or me to represent logged in user
 * @return response with retrieved data
 */
export const findAllTuitsDislikedByUser = (userId) =>
    api.get(`${USERS_API}/${userId}/dislikes`)
        .then(response => response.data);

/**
 * Finds all users who disliked a tuit
 * @param tid primary key of the tuit
 * @return response with retrieved data
 */
export const findAllUsersThatDislikedTuit = (tid) =>
    api.get(`${TUITS_API}/${tid}/dislikes`)
        .then(response => response.data);

/**
 * Marks a tuit disliked
 * @param uid primary key of the user
 * @param tid primary key of the tuit
 * @return response with retrieved data
 */
export const userDislikesTuit = (uid, tid) =>
    api.put(`${USERS_API}/${uid}/dislikes/${tid}`)
        .then(response => response.data);