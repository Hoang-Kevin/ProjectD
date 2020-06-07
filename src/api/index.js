import axios from 'axios';

const url = 'https://covid19.mathdro.id/api';

export const fetchData = async (country) => {
    let changeableUrl = url;

    if(country) {
        changeableUrl = `${url}/countries/${country}`
    }

    try {
        const { data: {confirmed, recovered, deaths, lastUpdate} } = await axios.get(changeableUrl);

        const modifiedData = {
            confirmed,
            recovered,
            deaths,
            lastUpdate,
        }

        return modifiedData;
    } catch (error) {
        console.log(error);
    }
}

export const fetchDailyData = async () => {
    try {
        const { data } = await axios.get(`${url}/daily`);

        const modifiedData = data.map((dailyData) => ({
            confirmed: dailyData.confirmed.total,
            deaths: dailyData.deaths.total,
            date: dailyData.reportDate,
        }))

        return modifiedData;

    } catch(error) {
        console.log(error);

    }
}

export const fetchCountries = async () => {

    try {
        const {data: { countries }} = await axios.get(`${url}/countries`)
        return countries.map((country) => country.name)
    } catch(error) {
        console.log(error);
    }

}

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

export const insertTask = payload => api.post(`/task`, payload)
export const getAllTasks = () => api.get(`/tasks`)
export const updateTaskById = (id, payload) => api.put(`/task/${id}`, payload)
export const deleteTaskById = id => api.delete(`/task/${id}`)
export const getTaskById = id => api.get(`/task/${id}`)
export const getTaskByProcess = id => api.get(`/task/process/${id}`)

const apis = {
    insertTask,
    getAllTasks,
    updateTaskById,
    deleteTaskById,
    getTaskById,
    getTaskByProcess,
}

export default apis