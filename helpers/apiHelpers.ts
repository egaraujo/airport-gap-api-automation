import { StaticVariables } from "./staticVariables"

let apiBaseURL = StaticVariables.staticApiBaseURL

export const getAirports = async (request: any, page?: string) => {
    return await request.get(`${apiBaseURL}/airports/${page}`, {
    })
}

export const getAirport = async (request: any, code: string) => {
    return await request.get(`${apiBaseURL}/airports/${code}`, {
    })
}

export const postDistance = async (request: any, codeFrom: string, codeTo: string) => {
    return await request.post(`${apiBaseURL}/airports/distance`, {
        data: {
            from: codeFrom,
            to: codeTo
        }
    })
}

export const postEmptyDistance = async (request: any) => {
    return await request.post(`${apiBaseURL}/airports/distance`, {
    })
}

export const postToken = async (request: any, testEmail: string, testPassword: string) => {
    return await request.post(`${apiBaseURL}/tokens`, {
        data: {
            email: testEmail,
            password: testPassword
        }
    })
}

export const getFavorites = async (request: any, authValue: string) => {
    return await request.get(`${apiBaseURL}/favorites`, {
        headers: {
            authorization: authValue
        }
    })
}

export const getFavorite = async (
    request: any, authValue: string, airportId: string) => {
    return await request.get(`${apiBaseURL}/favorites/${airportId}`, {
        headers: {
            authorization: authValue
        }
    })
}

export const postFavorite = async (
    request: any, authValue: string, airportId: string, airportNote: string) => {
    return await request.post(`${apiBaseURL}/favorites`, {
        data: {
            airport_id: airportId,
            note: airportNote,
        },
        headers: {
            authorization: authValue
        }
    })
}

export const patchFavorite = async (
    request: any, authValue: string, airportId: string, airportNote: string) => {
    return await request.patch(`${apiBaseURL}/favorites/${airportId}`, {
        data: {
            note: airportNote,
        },
        headers: {
            authorization: authValue
        }
  })
}

export const deleteFavorite = async (request: any, authValue: string, airportId: string) => {
    return await request.delete(`${apiBaseURL}/favorites/${airportId}`, {
        headers: {
            authorization: authValue
        }
    })
}

export const deleteFavorites = async (request: any, authValue: string) => {
    return await request.delete(`${apiBaseURL}/favorites/clear_all`, {
        headers: {
            authorization: authValue
        }
    })
}