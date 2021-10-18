import axios from "axios";

const state = () => ({
    monitors: [],
    accounts: [],

})

const getters = {

    MONITORS(state) {
        return state.monitors;
    },
}

const mutations = {

    SET_MONITORS: (state, content) => {
        state.monitors = content
    }
}

const actions = {
    GET_MONITORS({commit}) {
        return axios({
            method: "GET",
            url: "http://bexram.online:8004/getdata/",
        })
            .then((response) => {
                commit("SET_MONITORS", response.data);
                return response;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    },

    UPDATE_DATA({dispatch}) {
        return axios({
            method: "GET",
            url: "http://bexram.online:8004/updata/",
        })
            .then((response) => {
                dispatch(
                    this.GET_MONITORS)
                return response;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}