import axios from 'axios';

export async function fetchAllUsers() {
    try {
        const { data } = await axios.get("https://floating-stream-77094.herokuapp.com/api/users")
        return data.users
    } catch (err) {
        throw err;
    }
}

export async function fetchAllGames() {
    try {
        const { data } = await axios.get(`https://floating-stream-77094.herokuapp.com/api/games/active`)
        return data.games
    } catch (err) {
        throw err;
    }
}

export async function fetchAllPicks() {
    try {
        const { data } = await axios.get("https://floating-stream-77094.herokuapp.com/api/picks")
        return data.picks;
    } catch (err) {
        throw err;
    }
}

export async function fetchAllParlays() {
    try {
        const { data } = await axios.get("https://floating-stream-77094.herokuapp.com/api/parlays")
        return data.parlayPicks;
    } catch (err) {
        throw err;
    }
}

export async function fetchAllPicksixPicks() {
    try {
        const { data } = await axios.get("https://floating-stream-77094.herokuapp.com/api/picksix")
        return data.picksixPicks;
    } catch (err) {
        throw err;
    }
}

export async function fetchAllWeeklyPicks() {
    try {
        const { data } = await axios.get("https://floating-stream-77094.herokuapp.com/api/picks/weeklyPicks")
        return data.weeklypicks;
    } catch (err) {
        throw err;
    }
}

export async function fetchUserStats() {
    try {
        const { data } = await axios.get("https://floating-stream-77094.herokuapp.com/api/users/stats")
        return data.usersStats
    } catch (err) {
        throw err
    }
}

export async function getGameById(gameId) {
    try {
        const { data } = await axios.get(`https://floating-stream-77094.herokuapp.com/api/games/${gameId}`)
        return data.game
    } catch (err) {
        throw err
    }
}

export async function fetchCurrentPot(week) {
    try {
        const { data } = await axios.get(`https://floating-stream-77094.herokuapp.com/api/pot/week/${week}`)
        return data.potAmount
    } catch (err) {
        throw err
    }
}

export async function fetchAllPots() {
    try {
        const { data } = await axios.get(`https://floating-stream-77094.herokuapp.com/api/pot`)
        return data.potAmounts
    } catch (err) {
        throw err
    }
}

export async function fetchAllPosts() {
    try {
        const { data } = await axios.get(`https://floating-stream-77094.herokuapp.com/api/posts`)
        return data.posts
    } catch (err) {
        throw err
    }
}