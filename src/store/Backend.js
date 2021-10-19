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

        for (let i = 0; i < content.length; i++) {
            let cont={};
            cont.name=content[i].account.name;
            cont.er=content[i].er;
            cont.followers=content[i].followers;
            cont.target=content[i].percentage_kpi;
            cont.recomendation=content[i].canon_percentage_kpi;
            state.monitors.push(cont)
        }

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