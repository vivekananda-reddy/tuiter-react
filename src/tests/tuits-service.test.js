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
            _id: "6200341b183f03369d71d023",
            tuit: "test tuit1",
            postedOn: new Date(),
        },

        {
            _id: "6200341b183f03369d71d040",
            tuit: "test tuit2",
            postedOn: new Date(),
        },

        {
            _id: "6200341b183f03369d71d020",
            tuit: "test tuit3",
            postedOn: new Date(),
        },

    ]

    let userId;
    let newTuit;
    let testTuitIds = [];
    beforeAll(() => {

        return Promise.all(testTuits.map(tempTuit => createTuit("5200341b183f03369d71d021",tempTuit)));


    });

    afterAll( () => {
        //console.log(testTuitIds);

        return Promise.all(testTuits.map(testTuit => deleteTuit(testTuit._id)));
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