<script setup>
</script>

<script>
const USE_CURRENT_LOCATION = 'Use current location'
export default {
  data() {
    return {
      locationName: '',
      locationError: false,
      events: []
    }
  },
  methods: {
    searchLocations(input) {
      let searchTerm
      if (!input || input === USE_CURRENT_LOCATION) {
        searchTerm = 'MRT'
      } else {
        searchTerm = input
      }
      return new Promise((resolve) => {
        const onemapSearchUrl = new URL('https://www.onemap.gov.sg/api/common/elastic/search?returnGeom=Y&getAddrDetails=Y&pageNum=1')
        onemapSearchUrl.searchParams.append('searchVal', searchTerm)
        fetch(onemapSearchUrl)
          .then(response => response.json())
          .then(data => {
            resolve([USE_CURRENT_LOCATION].concat(data.results))
          })
      })
    },
    getResultValue(result) {
      if (result === USE_CURRENT_LOCATION) {
        return USE_CURRENT_LOCATION
      }
      return result.ADDRESS
    },
    handleSubmit(result) {
      document.getElementsByClassName('autocomplete-input')[0].blur()
      if (result === USE_CURRENT_LOCATION) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.searchEvents(position.coords.latitude, position.coords.longitude, 'current location')
        }, (error) => {
          this.locationError = true
          console.error(error)
        })
      } else {
        this.searchEvents(result.LATITUDE, result.LONGITUDE, this.getResultValue(result))
      }
    },
    handleFocus(event) {
      event.target.select()
    },
    searchEvents(lat, long, locationName) {
      this.locationName = locationName
      this.events = []
      this.locationError = false
      const searchEventsUrl = new URL('http://localhost:8000/events')
      searchEventsUrl.searchParams.append('lat', lat)
      searchEventsUrl.searchParams.append('long', long)
      fetch(searchEventsUrl)
        .then(response => response.json())
        .then(data => {
          this.events = data
        })
    }
  }
}
</script>

<template>
  <nav class="navbar sticky-top bg-body-tertiary border-bottom">
    <div class="container py-2 px-3 mx-auto">
      <header class="d-sm-flex flex-wrap justify-content-start align-items-md-center">
        <h1 class="h4 my-auto py-2 pe-3">Faith@Work</h1>
        <div class="flex-grow-1">
          <autocomplete
            placeholder="Office location (postal code, nearest MRT, building name, etc.)"
            :search="searchLocations"
            :get-result-value="getResultValue"
            @submit="handleSubmit"
            @focus="handleFocus"
            :debounce-time="500"
          >
          </autocomplete>
        </div>
      </header>
    </div>
  </nav>
  <div class="container py-3 px-3 mx-auto">
    <div v-if="locationError">
      <h4>Could not determine your current location</h4>
      <p>Please allow location permissions, or search by address instead</p>
    </div>
    <div v-else>
      <h4 v-if="locationName">Events near {{ locationName }}</h4>
      <h4 v-else>Start by entering your office location</h4>
      <div class="row">
        <div class="col-md-6 col-lg-4 py-2" v-for="event in events" :key="event.id">
          <div class="card">
            <img :src="event.logo.url" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ event.name.text }}</h5>
              <p class="card-text">{{ event.description.text }}</p>
              <a :href="event.url" class="btn btn-primary">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
