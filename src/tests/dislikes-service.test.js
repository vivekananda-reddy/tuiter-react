import {act, create} from 'react-test-renderer';
import TuitStats from "../components/tuits/tuit-stats";
import Tuits from "../components/tuits/index"
import {HashRouter} from "react-router-dom";

test('stats render correctly', () => {
    let stats = {
        dislikes: 200,
        likes: 123,
        replies: 234,
        retuits: 345
    }

    const dislikeTuit = () => {
        act(() => {
            stats.dislikes++;
            tuitStats.update(
                <TuitStats
                    tuit={{stats: stats}}
                    dislikeTuit={() => {}}
                />)
        })
    }

    let tuitStats
    act(() => {
        tuitStats = create(
            <TuitStats
                dislikeTuit={dislikeTuit}
                tuit={{stats: stats}}/>
        );
    })

    let root = tuitStats.root;
    let dislikesCounter = root.findByProps({className: 'ttr-stats-dislikes'});
    let dislikesText = dislikesCounter.children[1];

    expect(dislikesText).toBe('200');

    act(() => {dislikesCounter.props.onClick()})
    const dislikesText1 = dislikesCounter.children[1];
    expect(dislikesText1).toBe('201');


    const dislikeTuitDecrement = () => {
        act(() => {
            stats.dislikes--;
            tuitStats.update(
                <TuitStats
                    tuit={{stats: stats}}
                    dislikeTuit={() => {}}
                />)
        })
    }

    act(() => {
        tuitStats = create(
            <TuitStats
                dislikeTuit={dislikeTuitDecrement}
                tuit={{stats: stats}}/>
        );
    })

    root = tuitStats.root;
    dislikesCounter = root.findByProps({className: 'ttr-stats-dislikes'});
    dislikesText = dislikesCounter.children[1];

    act(() => {dislikesCounter.props.onClick()})
    const dislikesTextDecrement = dislikesCounter.children[1];
    expect(dislikesTextDecrement).toBe('200');

});

test('tuits render', () => {

    let tuitsJson = [
        { "_id":  "123",
            "tuit": "Alice's tuit"   },
        { "_id":  "234",
            "tuit": "Bob's tuit"     },
        { "_id":  "345",
            "tuit": "Charlie's tuit" }
    ]

    let tuitsRender
    act(() => {
        tuitsRender = create(
            <HashRouter>
            <Tuits
                tuits={tuitsJson}/>
            </HashRouter>
        )
    })
    const root = tuitsRender.root
    const ttrTuits = root.findAllByProps({className: 'ttr-tuit'})
    expect(ttrTuits.length).toBe(tuitsJson.length)
    ttrTuits.forEach((ttrTuit, ndx) => {
        expect(ttrTuit.props.children).toBe(tuitsJson[ndx].tuit)
    })
})

