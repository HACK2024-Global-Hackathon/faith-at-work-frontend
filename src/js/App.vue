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
      locationError: false,
      events: [],
      profile: {
        interests: window.localStorage.getItem('profile.interests') || 'fellowship',
        lifeStage: window.localStorage.getItem('profile.lifeStage') || 'single',
        ageGroup: window.localStorage.getItem('profile.ageGroup') || 'under30',
        gender: window.localStorage.getItem('profile.gender') || 'female',
        church: window.localStorage.getItem('profile.church') || ''
      },
      showExtendedQuestions: window.location.href.includes('extended'),
      isFreshProfile: window.localStorage.getItem('persisted') !== 'true'
    }
  },
  watch: {
    'profile.interests': function() {
      window.localStorage.setItem('profile.interests', this.profile.interests)
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
    if (this.isFreshProfile) {
      const profileModalElement = document.getElementById('profileModal')
      const profileModal = new Modal(profileModalElement)
      profileModalElement.addEventListener('hidden.bs.modal', () => {
        if (this.isFreshProfile) {
          window.localStorage.setItem('persisted', 'true')
          this.isFreshProfile = false
          profileModal.dispose()
        }
      })
      profileModal.show()
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
        navigator.geolocation.getCurrentPosition((position) => {
          this.searchEvents(position.coords.latitude, position.coords.longitude)
        }, (error) => {
          this.locationError = true
          console.error(error)
        })
      } else {
        this.locationName = this.getResultValue(location)
        this.searchEvents(location.LATITUDE, location.LONGITUDE)
      }
    },
    searchEvents(lat, long) {
      this.events = []
      this.locationError = false
      const searchEventsUrl = new URL('http://localhost:8000/events')
      searchEventsUrl.searchParams.append('latitude', lat)
      searchEventsUrl.searchParams.append('longitude', long)
      axios.get(searchEventsUrl)
        .then(response => {
          this.events = response.data
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
        <div class="flex-grow-1 pe-3">
          <div class="d-flex">
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
            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#profileModal">
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
  <div class="modal fade" id="profileModal" :data-bs-backdrop="isFreshProfile ? 'static' : true" :data-bs-keyboard="isFreshProfile ? 'false' : 'true'" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="profileModalLabel">{{ isFreshProfile ? 'Welcome! Let\'s set up your profile' : 'Update profile'}}</h1>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <select class="form-select" id="interests" v-model="profile.interests" aria-label="Select interests">
              <option value="fellowship">Fellowship</option>
              <option value="discipleship">Discipleship</option>
            </select>
            <label for="interests">Interests</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="life-stage" v-model="profile.lifeStage" aria-label="Select life stage">
              <option value="single">Single</option>
              <option value="singleWithKids">Single with kids</option>
              <option value="married">Married</option>
              <option value="marriedWithKids">Married with kids</option>
            </select>
            <label for="life-stage">Life stage</label>
          </div>
          <div class="form-floating mb-3" v-if="showExtendedQuestions">
            <select class="form-select" id="ageGroup" v-model="profile.ageGroup" aria-label="Select age group">
              <option value="under30">Under 30</option>
              <option value="30-39">30 to 39</option>
              <option value="40-49">40 to 49</option>
              <option value="50above">50 and above</option>
            </select>
            <label for="ageGroup">Age group</label>
          </div>
          <div class="form-floating mb-3" v-if="showExtendedQuestions">
            <select class="form-select" id="gender" v-model="profile.gender" aria-label="Select gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label for="gender">Gender</label>
          </div>
          <div class="form-floating" v-if="showExtendedQuestions">
            <input type="text" class="form-control" id="church" v-model="profile.church" placeholder="Church">
            <label for="church">Church</label>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="!isFreshProfile" type="button" class="btn btn-danger" data-bs-target="#confirmModal" data-bs-toggle="modal">Reset profile</button>
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
          <button v-if="!isFreshProfile" type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="clearData">Delete preferences</button>
        </div>
      </div>
    </div>
  </div>
  <div class="container py-3 px-3 mx-auto">
    <div v-if="locationError">
      <h4>Could not determine your current location</h4>
      <p>Please allow location permissions, or search by address instead</p>
    </div>
    <div v-else>
      <h4 v-if="locationName">Events near {{ locationName }}</h4>
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
