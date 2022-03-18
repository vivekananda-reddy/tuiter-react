import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits, deleteTuit} from "../services/tuits-service";
import axios from "axios";
import {UserList} from "../components/profile/user-list";
import {findAllUsers} from "../services/users-service";
import Tuit from "../components/tuits/tuit";

//jest.mock('axios');

const MOCKED_USERS = [
    {username: 'alice123', password: 'alice', email: 'repley@weyland.com', _id: "123"},
    {username: 'bob1', password: 'bob', email: 'bob@weyland.com', _id: "345"},
    {username: 'charlie2', password: 'charlie', email: 'charlie@weyland.com', _id: "456"},
];

// const MOCKED_TUITS =[
//     {_id: "1", tuit: "alice's tuit"},
//     {_id: "2", tuit: "bob's tuit"},
//     {_id: "3", tuit: "charlie's tuit"}
//
// ]
const MOCKED_TUITS = [
    {
        _id: "1",
        tuit: "alice's tuit",
        postedBy: MOCKED_USERS[0]
    },
    {
        _id: "2",
        tuit: "bob's tuit",
        postedBy: MOCKED_USERS[1]
    },
    {
        _id: "3",
        tuit: "charlie's tuit",
        postedBy: MOCKED_USERS[2]
    }
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>);
  const tuitTextElement = screen.getByText(/alice's tuit/i);
  const tuitUserElement = screen.getByText(/alice123/i)
  expect(tuitTextElement).toBeInTheDocument();
  expect(tuitUserElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
    const tuits = await findAllTuits();

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/In 2021, our @NASAPersevere Mars rover landed and our Ingenuity helicopter took flight. Two asteroid missions launched to the skies, and another began its journey home to Earth. A look back at highlights for our #NASAScience planetary missions/i);
    expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
    const mock = jest.spyOn(axios, 'get');
    axios.get.mockImplementation(() =>
                                     Promise.resolve({ data: {tuits: MOCKED_TUITS} }));

    const response = await findAllTuits();
    const tuits = response.tuits;

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);

    const user = screen.getByText(/bob's tuit/i);
    expect(user).toBeInTheDocument();
    mock.mockRestore();
});
