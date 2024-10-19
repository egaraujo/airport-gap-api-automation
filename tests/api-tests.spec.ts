import { test, expect } from '@playwright/test'
import { StaticVariables } from '../helpers/staticVariables'
import * as apiHelpers from '../helpers/apiHelpers'

test.describe('airport', () => {
  let authValue = `Token ${StaticVariables.staticToken}`
  let testEmail = StaticVariables.staticTestEmail
  let testPassword = StaticVariables.staticTestPassword

test.beforeAll('clear all favorite airports', async ({request}) => {
  await apiHelpers.deleteFavorites(request, authValue)
})

test('should retrieve specific paginated set of airports', async({request}) => {

    const response = await apiHelpers.getAirports(request, '?page=5')

    const responseJson = await response.json()
    const body = responseJson.data
    const links = responseJson.links
    
    expect(response.status()).toBe(200)
    expect(body).toHaveLength(30)
    expect(links.first).toContain("airports")
    expect(links.first).not.toContain("?page=")
    expect(links.prev).toContain("airports?page=4")
    expect(links.self).toContain("airports?page=5")
    expect(links.next).toContain("airports?page=6")
    expect(links.last).toContain("airports?page=")
  })

test('should retrieve a specific airport', async({request}) => {

    const response = await apiHelpers.getAirport(request, 'EZE')

    const responseJson = await response.json()
    const body = responseJson.data

    expect(response.status()).toBe(200)
    expect(body.id).toEqual("EZE")
    expect(body.type).toEqual("airport")
    expect(body.attributes.name).toEqual("Ministro Pistarini International Airport")
    expect(body.attributes.city).toEqual("Buenos Aires")
    expect(body.attributes.country).toEqual("Argentina")
    expect(body.attributes.iata).toEqual("EZE")
  })

  test('should not find a wrong airport code', async({request}) => {

    const response = await apiHelpers.getAirport(request, 'XYZ')

    const responseJson = await response.json()
    const errors = responseJson.errors

    expect(response.status()).toBe(404)
    expect(errors[0].title).toBe("Not Found")
    expect(errors[0].detail).toBe("The page you requested could not be found")
  })

  test('should retrieve information between two given airports', async({request}) => {

    const response = await apiHelpers.postDistance(request, 'ASU', 'MVD')

    const responseJson = await response.json()
    const data = responseJson.data

    expect(response.status()).toBe(200)

    expect(data.id).toEqual("ASU-MVD")
    expect(data.type).toEqual("airport_distance")

    expect(data.attributes.from_airport.iata).toEqual("ASU")
    expect(data.attributes.from_airport.name).toEqual("Silvio Pettirossi International Airport")
    expect(data.attributes.from_airport.city).toEqual("Asuncion")
    expect(data.attributes.from_airport.country).toEqual("Paraguay")

    expect(data.attributes.to_airport.iata).toEqual("MVD")
    expect(data.attributes.to_airport.name).toEqual("Carrasco International /General C L Berisso Airport")
    expect(data.attributes.to_airport.city).toEqual("Montevideo")
    expect(data.attributes.to_airport.country).toEqual("Uruguay")

    expect(data.attributes.kilometers).toEqual(1076.8324376156143)
    expect(data.attributes.miles).toEqual(668.6468565699843)
    expect(data.attributes.nautical_miles).toEqual(581.0379538834393)
  })

  test('should ask for airports when not provided', async({request}) => {

    const response = await apiHelpers.postEmptyDistance(request)

    const responseJson = await response.json()
    const errors = responseJson.errors

    expect(response.status()).toBe(422)
    expect(errors[0].title).toEqual("Unable to process request")
    expect(errors[0].detail).toEqual("Please enter valid 'from' and 'to' airports.")
  })

  test('should retrieve token', async({request}) => {

    const response = await apiHelpers.postToken(request, testEmail, testPassword)

    const responseJson = await response.json()
    const token = responseJson.token
    
    expect(response.status()).toBe(200)
    expect(token).toHaveLength(24)
  })

  test('should retrieve created favorite', async({request}) => {

    // post favorite
    let response = await apiHelpers.postFavorite(request, authValue, 'BLB', 'Panama')
    
    let respJson = await response.json()
    let respData = respJson.data
    let airportId = respData.id
        
    expect(response.status()).toBe(201)
    expect(respData.type).toEqual("favorite")
    expect(respData.attributes.airport.iata).toEqual("BLB")
    expect(respData.attributes.note).toEqual("Panama")

    // get favorite
    response = await apiHelpers.getFavorite(request, authValue, airportId)

    expect(response.status()).toBe(200)
    expect(respData.type).toEqual("favorite")
    expect(respData.attributes.airport.iata).toEqual("BLB")
    expect(respData.attributes.note).toEqual("Panama")

    // delete favorite
    let deleteResponse = await apiHelpers.deleteFavorite(request, authValue, airportId)
    
    expect(deleteResponse.status()).toBe(204)

    // get favorites
    let getResponse = await apiHelpers.getFavorites(request, authValue)

    const responseJson = await getResponse.json()
    const data = responseJson.data

    expect(getResponse.status()).toBe(200)
    expect(data).toHaveLength(0)
  })

  test('should update favorite airport', async({request}) => {

    // create favorite
    let response = await apiHelpers.postFavorite(request, authValue, 'SCL', 'Chile')
    
    let respJson = await response.json()
    let respData = respJson.data
        
    expect(response.status()).toBe(201)
    expect(respData.type).toEqual("favorite")
    expect(respData.attributes.airport.iata).toEqual("SCL")
    expect(respData.attributes.note).toEqual("Chile")

    //patch favorite
    let airportId = respData.id
    let patchResponse = await apiHelpers.patchFavorite(request, authValue, airportId, 'Chile (PATCH)')
    
    let responseJson = await patchResponse.json()
    let data = responseJson.data
        
    expect(response.status()).toBe(201)
    expect(respData.type).toEqual("favorite")
    expect(data.attributes.airport.iata).toEqual("SCL")
    expect(data.attributes.note).toEqual('Chile (PATCH)')

    // delete favorite
    let deleteResponse = await apiHelpers.deleteFavorite(request, authValue, airportId)
    
    expect(deleteResponse.status()).toBe(204)

    // get favorites
    let getResponse = await apiHelpers.getFavorites(request, authValue)

    responseJson = await getResponse.json()
    data = responseJson.data

    expect(getResponse.status()).toBe(200)
    expect(data).toHaveLength(0)
  })

  test('should delete all favorites', async({request}) => {

    // create first favorite
    let firstResponse = await apiHelpers.postFavorite(request, authValue, 'BSB', 'Brasil')

    let firstResponseJson = await firstResponse.json()
    let firstData = firstResponseJson.data
    
    expect(firstResponse.status()).toBe(201)
    expect(firstData.type).toEqual("favorite")
    expect(firstData.attributes.airport.iata).toEqual("BSB")
    expect(firstData.attributes.note).toEqual("Brasil")

    // create second favorite
    let secondResponse = await apiHelpers.postFavorite(request, authValue, 'MEX', 'Mexico')

    let secondResponseJson = await secondResponse.json()
    let secondData = secondResponseJson.data
    
    expect(secondResponse.status()).toBe(201)
    expect(firstData.type).toEqual("favorite")
    expect(secondData.attributes.airport.iata).toEqual("MEX")
    expect(secondData.attributes.note).toEqual("Mexico")

    // delete all favorites
    const response = await apiHelpers.deleteFavorites(request, authValue)

    expect(response.status()).toBe(204)

    // get favorites
    let getResponse = await apiHelpers.getFavorites(request, authValue)

    const responseJson = await getResponse.json()
    const data = responseJson.data

    expect(getResponse.status()).toBe(200)
    expect(data).toHaveLength(0)
  })

})