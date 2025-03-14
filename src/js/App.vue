<script setup>
import axios from 'axios'
import axiosRetry from 'axios-retry'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { Modal } from 'bootstrap'
import logo from '../assets/logo.png'

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })
dayjs.extend(calendar)
dayjs.extend(localizedFormat)
</script>

<script>
const USE_CURRENT_LOCATION = 'Use current location'
const DEFAULT_URL = 'https://www.eventbrite.com/e/hack2024-singapore-tech-solutions-for-his-kingdom-tickets-934306344427'
export default {
  data() {
    return {
      locationName: '',
      locationLat: null,
      locationLong: null,
      locationError: false,
      isLoading: false,
      events: [],
      preferences: {
        category: window.localStorage.getItem('preferences.category') || 'biblestudy',
        daterange: 'anytime'
      },
      profile: {
        lifeStage: window.localStorage.getItem('profile.lifeStage') || '',
        ageGroup: window.localStorage.getItem('profile.ageGroup') || '',
        gender: window.localStorage.getItem('profile.gender') || '',
        church: window.localStorage.getItem('profile.church') || '',
        industry: window.localStorage.getItem('profile.industry') || ''
      },
      dfp: ''
    }
  },
  watch: {
    'preferences.category': function() {
      window.localStorage.setItem('preferences.category', this.preferences.category)
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
    },
    'profile.industry': function() {
      window.localStorage.setItem('profile.industry', this.profile.industry)
    }
  },
  mounted() {
    FingerprintJS.load()
      .then(fp => fp.get())
      .then(result => {
        this.dfp = result.visitorId
      }).finally(() => {
        const storedLocation = JSON.parse(window.localStorage.getItem('location') || '{"SEARCHVAL":"UOB PLAZA","BLK_NO":"80","ROAD_NAME":"RAFFLES PLACE","BUILDING":"UOB PLAZA","ADDRESS":"80 RAFFLES PLACE UOB PLAZA SINGAPORE 048624","POSTAL":"048624","X":"29919.6657234635","Y":"29759.2535518501","LATITUDE":"1.28540656780796","LONGITUDE":"103.850567541206"}')
        if (storedLocation) {
          this.processSelectedLocation(storedLocation)
        }
      })
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
      if (!this.locationLat || !this.locationLong) {
        return
      }
      this.events = []
      this.locationError = false
      const searchEventsUrl = new URL('https://faith-at-work-backend-392395172966.asia-east1.run.app/events')
      searchEventsUrl.searchParams.append('latitude', this.locationLat)
      searchEventsUrl.searchParams.append('longitude', this.locationLong)
      searchEventsUrl.searchParams.append('interest_category', this.preferences.category)
      this.isLoading = true
      axios.get(searchEventsUrl, { headers: { 'X-Device-Fingerprint': this.dfp }})
        .then(response => {
          const mockData = this.locationLat === '1.30005342428219' && this.locationLong === '103.788202474431' && this.preferences.category === 'biblestudy' ? [{
            "uuid": "TeP68B7eEMSmaiIZ0ohc",
            "title": "Bible and Breakfast for Busy Techies",
            "summary": "Start your day right with a hearty breakfast and some soul-nourishing Bible study - join us for Bible and Breakfast!",
            "eventbrite_url": "https://www.eventbrite.sg/e/bible-and-breakfast-for-busy-techies-tickets-1071483278329?aff=oddtdtcreator",
            "image_url": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F890086793%2F2463582091251%2F1%2Foriginal.png?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=417eb92ffc26cb9d617ac2ec74071693",
            "organizer": "Kenny",
            "datetime_start": "2024-12-11T10:00:00Z",
            "datetime_end": "2024-12-11T13:30:00Z",
            "distance_m": 0,
            "walking_time_mins": 0
          }] : []
          this.events = mockData.concat(response.data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearData() {
      window.localStorage.clear()
      window.location.reload()
    },
    shareUrl(url) {
      navigator.share({ url })
        .catch(e => console.error(e))
    }
  }
}
</script>

<template>
  <nav class="navbar sticky-top bg-body-tertiary border-bottom">
    <div class="container py-2 px-3 mx-auto">
      <header class="d-sm-flex flex-wrap justify-content-start align-items-md-center">
        <div class="d-flex flex-nowrap">
          <img :src="logo" class="pe-1" style="width: 3em">
          <h1 class="h4 my-auto py-2 pe-3">Faith@Work</h1>
        </div>
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
                :submitOnEnter="true"
              >
              </autocomplete>
              <button type="button" class="btn border px-3" data-bs-toggle="modal" data-bs-target="#preferencesModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
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
  <div class="modal fade" id="preferencesModal" tabindex="-1" aria-labelledby="preferencesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-sm-down modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="preferencesModalLabel">Preferences</h1>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <select class="form-select" id="category" v-model="preferences.category" aria-label="Select category">
              <option value="fellowship">Fellowship</option>
              <option value="biblestudy">Bible study</option>
              <option value="prayer&worship">Prayer & worship</option>
              <option value="sports&wellness">Sports & wellness</option>
              <option value="volunteering">Volunteering</option>
              <option value="workshops">Workshops</option>
            </select>
            <label for="category">Category</label>
          </div>
          <div class="form-floating">
            <select class="form-select" id="daterange" v-model="preferences.daterange" aria-label="Select when">
              <option value="anytime">Anytime</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="thisWeek">This week</option>
              <option value="nextWeek">Next week</option>
              <option value="thisMonth">This month</option>
            </select>
            <label for="daterange">When</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="searchEvents">Search</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="profileModalLabel">Profile</h1>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <select class="form-select" id="life-stage" v-model="profile.lifeStage" aria-label="Select life stage">
              <option selected></option>
              <option value="single">Single</option>
              <option value="singleWithKids">Single with kids</option>
              <option value="married">Married</option>
              <option value="marriedWithKids">Married with kids</option>
            </select>
            <label for="life-stage">Life stage</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="ageGroup" v-model="profile.ageGroup" aria-label="Select age group">
              <option selected></option>
              <option value="under30">Under 30</option>
              <option value="30-39">30 to 39</option>
              <option value="40-49">40 to 49</option>
              <option value="50above">50 and above</option>
            </select>
            <label for="ageGroup">Age group</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="gender" v-model="profile.gender" aria-label="Select gender">
              <option selected></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label for="gender">Gender</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="church" v-model="profile.church" placeholder="Church">
            <label for="church">Church</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="church" v-model="profile.industry" placeholder="Industry">
            <label for="industry">Industry</label>
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
          This will delete your preferences and profile.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-target="#profileModal" data-bs-toggle="modal">Cancel</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="clearData">Delete data</button>
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
      <h5>Could not determine your current location</h5>
      <p>Please allow location permissions, or search by address instead</p>
    </div>
    <div v-else>
      <h5>Activities near {{ locationName }}</h5>
      <div class="row">
        <div class="col-md-6 col-lg-4 py-2" v-for="event in events" :key="event.uuid">
          <div class="card">
            <img :src="event.image_url" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ event.title }}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">{{ event.organizer }}</h6>
              <p class="card-text">{{ event.summary }}</p>
              <div class="d-flex justify-content-between align-items-stretch">
                <p class="card-text text-body-secondary my-auto">
                  {{ Math.round(event.distance_m / 1000 * 10) / 10 }}km away
                </p>
                <p class="card-text text-body-secondary my-auto">{{ dayjs(event.datetime_start).calendar(null, { sameElse: 'ddd, DD MMM [at] LT' }) }}</p>
              </div>
              <div class="d-flex justify-content-end mt-3">
                <div class="pe-1">
                  <button class="btn btn-primary" @click="shareUrl(event.eventbrite_url || DEFAULT_URL)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                      <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                    </svg>
                    Share
                  </button>
                </div>
                <div>
                  <a class="btn btn-primary" :href="event.eventbrite_url || DEFAULT_URL">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                    </svg>
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
