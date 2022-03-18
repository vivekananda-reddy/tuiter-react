import {createUser, deleteUsersByUsername, findUserById} from "../services/users-service";
import {createTuit, deleteTuit, findAllTuits, findTuitById} from "../services/tuits-service";

describe('can create tuit with REST API', () => {

    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    const testTuit = {
        tuit: "test tuit",
        postedOn: new Date(),
        postedBy: sowell
    }

    let userId;
    let newTuit;

    // setup the tests before verification
    beforeAll(() => {

        return createUser(sowell).then((response) => userId = response._id);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(sowell.username).then(() => deleteTuit(newTuit._id));

    });

    test('can insert new tuits with REST API', async () => {

         newTuit = await createTuit(userId, testTuit);

        expect(newTuit.tuit).toEqual(testTuit.tuit);
        expect(new Date(newTuit.postedOn)).toEqual(testTuit.postedOn);
        findUserById(newTuit.postedBy).then(response => expect(response.username).toEqual(testTuit.postedBy.username));

    });
});

describe('can delete tuit with REST API', () => {

    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    const testTuit = {
        tuit: "test tuit",
        postedOn: new Date(),
        postedBy: sowell
    }

    let userId;
    let newTuit;

    // setup the tests before verification
    beforeAll(() => {

        return createUser(sowell).then((response) => userId = response._id);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(sowell.username).then(() => deleteTuit(newTuit._id));

    });

    test('can insert new tuits with REST API', async () => {

        newTuit = await createTuit(userId, testTuit);

        deleteTuit(newTuit._id).then((status)=> expect(status.deletedCount).toBeGreaterThanOrEqual(1));

    });

});

describe('can retrieve a tuit by their primary key with REST API', () => {
    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    const testTuit = {
        tuit: "test tuit",
        postedOn: new Date(),
        postedBy: sowell
    }

    let userId;
    let newTuit;

    // setup the tests before verification
    beforeAll(() => {

        return createUser(sowell).then((response) => createTuit(response._id, testTuit).then(response => newTuit = response));
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(sowell.username).then(() => deleteTuit(newTuit._id));

    });

    test('can retrieve a tuit by their primary key with REST API', async () => {

        const retrievedTuit = await findTuitById(newTuit._id);
        expect(retrievedTuit.tuit).toEqual(testTuit.tuit);
        expect(new Date(retrievedTuit.postedOn)).toEqual(testTuit.postedOn);
        expect(retrievedTuit.postedBy.username).toEqual(testTuit.postedBy.username);

    });

});

describe('can retrieve all tuits with REST API', () => {
    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    const testTuits = [
        {
            tuit: "test tuit1",
            postedOn: new Date(),
        },

        {
            tuit: "test tuit2",
            postedOn: new Date(),
        },

        {
            tuit: "test tuit3",
            postedOn: new Date(),
        },

    ]

    let userId;
    let newTuit;
    let testTuitIds = [];
    beforeAll(() => {

        return createUser(sowell).then(testUser => Promise.all(testTuits.map(tempTuit => {
            const response = createTuit(testUser._id,tempTuit);
            testTuitIds.push(response._id);
        })));

    });

    afterAll(  () => {
        //console.log(testTuitIds);

        return deleteUsersByUsername(sowell.username).then(response => Promise.all(testTuitIds.map(tuitId => deleteTuit(tuitId.toString()))));
    });

    test("can retrieve all tuits with REST API", async () => {
        const retreivedTuits = await findAllTuits();
        //console.log(retreivedTuits);
        expect(retreivedTuits.length).toBeGreaterThanOrEqual(testTuits.length);
        const tuitsWeInserted = retreivedTuits.filter(tuit => testTuitIds.indexOf(tuit._id) >= 0);


        tuitsWeInserted.forEach(eachTuit => {
            const tempTuit = testTuits.find(testTuit => testTuit.tuit === eachTuit.tuit);
            expect(tempTuit.tuit).toEqual(eachTuit.tuit);
            expect(tempTuit.postedOn) .toEqual(new Date(eachTuit.postedOn));
            findUserById(eachTuit.postedBy).then(response => expect(response.username).toEqual(tempTuit.postedBy.username));

        });
    });
});