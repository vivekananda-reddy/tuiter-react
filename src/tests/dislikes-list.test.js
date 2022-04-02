import {userDislikesTuit, findAllUsersThatDislikedTuit, findAllTuitsDislikedByUser} from "../services/dislikes-service";
import {login, register} from "../services/security-service";
import {deleteUser} from "./services";
import {createTuit, deleteTuit} from "../services/tuits-service";

describe('createDislike', () => {

    const testUser = {
        _id: "62003943477e097cdac6f5d3",
        username: "test",
        password: "test",
        email: "test@gmail.com"
    }


    const testTuit = {
        tuit: "test tuit",
    };

    let tuitId;
    // setup test before running test
    beforeAll(async() => {
        await register(testUser);
        await login(testUser);
        const response = await createTuit(testUser._id,testTuit);
        tuitId = response._id;

    })

    // clean up after test runs
    afterAll(async() => {
        // remove any data we created, same service toggles the dislike
        await deleteUser(testUser._id);
        await deleteTuit(tuitId);
        return userDislikesTuit(testUser._id,tuitId);
    })

    test('can insert new users with REST API', async () => {

        const status = await userDislikesTuit(testUser._id,tuitId);
        expect(status).toEqual("OK");
    });

});

describe('find users who disliked the tuit', () => {

    const testUser = {
        _id: "62003943477e097cdac6f5d4",
        username: "test",
        password: "test",
        email: "test@gmail.com"
    }

    const testTuit = {
        tuit: "test tuit",
    };

    let tuitId;
    // setup test before running test
    beforeAll(async() => {
        await register(testUser);
        await login(testUser);
        const response = await createTuit(testUser._id,testTuit);
        tuitId = response._id;
    })

    // clean up after test runs
    afterAll(async() => {
        // remove any data we created, same service toggles the dislike
        await deleteUser(testUser._id);
        await deleteTuit(tuitId);
        return userDislikesTuit(testUser._id,tuitId);
    })

    test('Retrieve users who disliked a tuit ', async () => {
        await userDislikesTuit(testUser._id,tuitId);
        const users = await findAllUsersThatDislikedTuit(tuitId);
        expect(users.username).toEqual(testUser.username);
    });

});