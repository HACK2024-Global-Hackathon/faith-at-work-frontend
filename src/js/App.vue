<script setup>
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { Modal } from 'bootstrap'

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })
</script>

<script>
const USE_CURRENT_LOCATION = 'Use current location'
export default {
  data() {
    return {
      locationName: '',
      locationLat: null,
      locationLong: null,
      locationError: false,
      isLoading: false,
      events: [],
      filters: {
        interests: window.localStorage.getItem('filters.interests') || 'fellowship',
      },
      profile: {
        lifeStage: window.localStorage.getItem('profile.lifeStage') || 'single',
        ageGroup: window.localStorage.getItem('profile.ageGroup') || 'under30',
        gender: window.localStorage.getItem('profile.gender') || 'female',
        church: window.localStorage.getItem('profile.church') || ''
      }
    }
  },
  watch: {
    'filters.interests': function() {
      window.localStorage.setItem('filters.interests', this.filters.interests)
    },
    'profile.lifeStage': function() {
      window.localStorage.setItem('profile.lifeStage', this.profile.lifeStage)
    },
    'profile.ageGroup': function() {
      window.localStorage.setItem('profile.ageGroup', this.profile.ageGroup)
    },
    'profile.gender': function() {
      window.localStorage.setItem('profile.gender', this.profile.gender)
    },
    'profile.church': function() {
      window.localStorage.setItem('profile.church', this.profile.church)
    }
  },
  mounted() {
    const storedLocation = JSON.parse(window.localStorage.getItem('location') || 'null')
    if (storedLocation) {
      this.processSelectedLocation(storedLocation)
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
        axios.get(onemapSearchUrl)
          .then(response => {
            resolve([USE_CURRENT_LOCATION].concat(response.data.results))
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
      window.localStorage.setItem('location', JSON.stringify(result))
      this.processSelectedLocation(result)
    },
    handleFocus(event) {
      event.target.select()
    },
    processSelectedLocation(location) {
      if (location === USE_CURRENT_LOCATION) {
        this.locationName = 'current location'
        this.isLoading = true
        navigator.geolocation.getCurrentPosition((position) => {
          this.locationLat = position.coords.latitude
          this.locationLong = position.coords.longitude
          this.searchEvents()
        }, (error) => {
          this.locationError = true
          this.isLoading = false
          console.error(error)
        })
      } else {
        this.locationName = this.getResultValue(location)
        this.locationLat = location.LATITUDE
        this.locationLong = location.LONGITUDE
        this.searchEvents()
      }
    },
    searchEvents() {
      this.events = []
      this.locationError = false
      const searchEventsUrl = new URL('https://faith-at-work-backend-392395172966.asia-east1.run.app/events')
      searchEventsUrl.searchParams.append('latitude', this.locationLat)
      searchEventsUrl.searchParams.append('longitude', this.locationLong)
      searchEventsUrl.searchParams.append('interest_category', this.filters.interests)
      this.isLoading = true
      axios.get(searchEventsUrl)
        .then(response => {
          this.events = [{
            "uuid": "ylnvhAioqezN7xWOMREV",
            "title": "#HACK2024 Singapore: Tech solutions for His Kingdom",
            "summary": "#HACK is the largest global Christian hackathon for anyone who is passionate about leveraging technology to address missional projects.",
            "eventbrite_url": "https://www.eventbrite.com/e/hack2024-singapore-tech-solutions-for-his-kingdom-tickets-934306344427",
            "date": "2024-10-25T12:00:00Z",
            "image_url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F796565779%2F297979351972%2F1%2Foriginal.20240626-094251?h=200&w=450&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C341%2C2732%2C1366&s=ee918b23e458b906b41579a70a82c9ee"
          }].concat(response.data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearData() {
      window.localStorage.clear()
      window.location.reload()
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
          <div class="d-flex">
            <div class="d-flex flex-nowrap input-group pe-3">
              <autocomplete
                class="flex-grow-1"
                placeholder="Office location (postal code, nearest MRT, building name, etc.)"
                :search="searchLocations"
                :get-result-value="getResultValue"
                @submit="handleSubmit"
                @focus="handleFocus"
                :debounce-time="500"
              >
              </autocomplete>
              <button type="button" class="btn border px-3" data-bs-toggle="modal" data-bs-target="#filterModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                </svg>
              </button>
            </div>
            <button type="button" class="btn border" data-bs-toggle="modal" data-bs-target="#profileModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  </nav>
  <div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="filterModalLabel">Filters</h1>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <select class="form-select" id="interests" v-model="filters.interests" aria-label="Select interests">
              <option value="fellowship">Fellowship</option>
              <option value="biblestudy">Bible study</option>
              <option value="prayer&worship">Prayer & worship</option>
              <option value="sports&wellness">Sports & wellness</option>
              <option value="volunteering">Volunteering</option>
              <option value="workshops">Workshops</option>
            </select>
            <label for="interests">Interests</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="searchEvents">Search</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="profileModalLabel">Update profile</h1>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <select class="form-select" id="life-stage" v-model="profile.lifeStage" aria-label="Select life stage">
              <option value="single">Single</option>
              <option value="singleWithKids">Single with kids</option>
              <option value="married">Married</option>
              <option value="marriedWithKids">Married with kids</option>
            </select>
            <label for="life-stage">Life stage</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="ageGroup" v-model="profile.ageGroup" aria-label="Select age group">
              <option value="under30">Under 30</option>
              <option value="30-39">30 to 39</option>
              <option value="40-49">40 to 49</option>
              <option value="50above">50 and above</option>
            </select>
            <label for="ageGroup">Age group</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="gender" v-model="profile.gender" aria-label="Select gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label for="gender">Gender</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="church" v-model="profile.church" placeholder="Church">
            <label for="church">Church</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-target="#confirmModal" data-bs-toggle="modal">Reset profile</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Let's go!</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="confirmModalLabel">Are you sure?</h1>
        </div>
        <div class="modal-body">
          This will delete your preferences.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="clearData">Delete preferences</button>
        </div>
      </div>
    </div>
  </div>
  <div class="container py-3 px-3 mx-auto">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="locationError">
      <h4>Could not determine your current location</h4>
      <p>Please allow location permissions, or search by address instead</p>
    </div>
    <div v-else>
      <h4 v-if="locationName">Activities near {{ locationName }}</h4>
      <h4 v-else>Start by entering your office location</h4>
      <div class="row">
        <div class="col-md-6 col-lg-4 py-2" v-for="event in events" :key="event.uuid">
          <div class="card">
            <img :src="event.image_url" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ event.title }}</h5>
              <p class="card-text">{{ event.summary }}</p>
              <a :href="event.eventbrite_url" class="btn btn-primary">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
