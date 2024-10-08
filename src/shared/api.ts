const apiUrl: string = 'https://costumier.pro/api/v1/' 

export async function fetchApi<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${apiUrl}${path}`, init)
        return await response.json()
  }

export async function fetchApiResponse(
    path: string,
    init?: RequestInit,
  ) {
    const response = await fetch(`${apiUrl}${path}`, init)
    return response
  }

export async function Authorize(data: any) {
    return await fetchApiResponse(`auth/login`, {
        method: 'POST',
        body: data.toString(),
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
    })
  }

interface Refresh {
    refresh_token: string | undefined, 
}

export async function refreshToken(data: Refresh) {
    return await fetchApiResponse(`auth/refreshToken`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },

    })
  }

export async function getAds(ad_placement: string, offset: string | number, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/ads?ad_placement=${ad_placement}&offset=${offset}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }


export async function getAdById(ad_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/ads/${ad_placement}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }

export async function deleteAd(ad_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/ads?ad_id=${ad_placement}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'DELETE'
    })
  }

interface AdData {
    ad_placement: string, 
    manufacturer_id: string,
    start_date: string,
    end_date: string
}


export async function patchAd(data: AdData, ad_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/ads/${ad_placement}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

export async function createAd(data: AdData, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/ads/create`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
  }



export async function getCategories(language: string) {
    return await fetchApiResponse(`items/categories?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

export async function getManufacturers(accessToken: string | undefined | null, category_id: string, language: string, offset?: number, status?: string, startswith?: string) {
    return await fetchApiResponse(`admin/manufacturers?category_id=${category_id}&language=${language}&offset=${offset}&status=${status === 'pending' ? 'pending' : 'accepted'}&startswith=${startswith ? startswith : ''}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }

export async function getManufacturerById(accessToken: string | undefined | null, manufacturer_id: string, language: string) {
    return await fetchApiResponse(`admin/manufacturers/${manufacturer_id}?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }

export async function deleteManufacturerApplication(manufacturer_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/manufacturers/${manufacturer_placement}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'DELETE'
    })
  }

interface manufacturerData {
    status: string
}


export async function patchManufacturerApplication(data: manufacturerData, ad_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/manufacturers/${ad_placement}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }


export async function patchManufacturer(data: FormData, ad_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/manufacturers/${ad_placement}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'PATCH',
      body: data
    })
  }

export async function createManufacturer(data: FormData, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/manufacturers/create`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'POST',
      body: data
    })
  }



export async function getEvents(accessToken: string | undefined | null, language: string, offset?: number, startswith?: string) {
    return await fetchApiResponse(`admin/events?language=${language}&offset=${offset}&startswith=${startswith ? startswith : ''}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }

export async function getEventById(event_id: string, accessToken: string | undefined | null, language: string) {
    return await fetchApiResponse(`admin/events/${event_id}?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }


export async function deleteEvent(event_id: string, accessToken: string | undefined | null) {
    return await fetchApiResponse(`admin/events/${event_id}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'DELETE'
    })
  }


export async function patchEvent(data: FormData, event_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/events/${event_placement}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'PATCH',
      body: data
    })
  }

export async function createEvent(data: FormData, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/events/create`, {
      headers: {

        'Authorization': `Bearer ${accessToken}`
      },
      method: 'POST',
      body: data
    })
  }


  export async function getCostumes(accessToken: string | undefined | null, language: string, offset?: number) {
    return await fetchApiResponse(`admin/costumes?language=${language}&offset=${offset}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
  }

export async function deleteCostume(event_id: string, accessToken: string | undefined | null) {
    return await fetchApiResponse(`admin/costumes/${event_id}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'DELETE'
    })
  }


export async function patchCostume(data: any, event_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/costumes/${event_placement}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'PATCH',
      body: data
    })
  }

export async function createCostume(data: any, accessToken: string | null | undefined) {
    return await fetchApiResponse(`admin/costumes/create`, {
      headers: {

        'Authorization': `Bearer ${accessToken}`
      },
      method: 'POST',
      body: data
    })
  }


export async function deleteCategory(event_id: string, accessToken: string | undefined | null) {
    return await fetchApiResponse(`items/categories/${event_id}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'DELETE'
    })
  }


export async function patchCategory(data: any, event_placement: string, accessToken: string | null | undefined) {
    return await fetchApiResponse(`items/categories/${event_placement}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      method: 'PATCH',
      body: data
    })
  }

export async function createCategory(data: any, accessToken: string | null | undefined) {
    return await fetchApiResponse(`items/categories/create`, {
      headers: {

        'Authorization': `Bearer ${accessToken}`
      },
      method: 'POST',
      body: data
    })
  }
