<template>
  <div class="ui stackable grid container">
    <UserSettingsMenu/>

    <div class="eight wide column">
      <div class="ui segment">
        <h2 class="ui dividing header">Edit Profile</h2>
        <Error
          :message="notification.message"
          :type="notification.type"
          v-if="notification.message"
        />
        <sui-card style="margin: 0 auto;text-align: center;">
          <sui-image v-bind:src="cropped ? cropped : avatar" style="object-fit: contain;"/>
          <sui-card-content>
              <sui-button @click.native="toggle">Upload Avatar</sui-button>
          </sui-card-content>
        </sui-card>
        <img  alt="">
        <!-- -->
        <form class="ui form" @submit.prevent="updateProfile">
          <div class="field" :class="{ error: errors.has('name') }">
            <label>Full Name</label>
            <input type="text" name="name" v-model="name" v-validate="'required'">
            <span v-show="errors.has('name')" class="is-danger">{{ errors.first('name') }}</span>
          </div>

          <div class="field" :class="{ error: errors.has('name') }">
            <label>Username</label>
            <input type="text" name="username" v-model="username" v-validate="'required'">
            <span v-show="errors.has('username')" class="is-danger">{{ errors.first('username') }}</span>
          </div>

          <div class="field" :class="{ error: errors.has('email') }">
            <label>Email</label>
            <input type="email" name="email" v-model="email" v-validate="'required|email'" placeholder="Email">
            <span v-show="errors.has('email')" class="is-danger">{{ errors.first('email') }}</span>
          </div>

          <div class="field">
            <label>Bio</label>
            <textarea v-model="bio" rows="5" placeholder="A breif bio of you"></textarea>
          </div>

          <div class="field">
            <label>Location</label>
            <input type="text" v-model="location" placeholder="Your location">
          </div>

          <div class="field">
            <label>Website URL</label>
            <input type="url" v-model="websiteUrl" placeholder="Website URL">
          </div>

          <button class="ui button primary">Update profile</button>
        </form>
      </div>
    </div>
    <sui-modal v-model="open">
        <sui-modal-header>Select a Photo</sui-modal-header>
        <sui-modal-content image>
          <label for="avatar">
            <div class="ui medium image">
              <img alt="avatar" v-bind:src="cropped ? cropped : avatar">
            </div>
          </label>
          <input type="file" id="avatar" name="avatar" ref="file" style="display:none" v-on:change="handleFileUpload()"/> 
          <sui-modal-description>
            <vue-croppie 
                ref="croppieRef" 
                :enableResize="false"
                :enableOrientation="true"
                :enableExif="true"
                :boundary="{ width: 300, height: 300}"
                :viewport="{width:300,height:300}"
                @result="result"
                @update="update">
            </vue-croppie>
            <!-- the result -->
            <img >
          </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
              <sui-button-group>
                <sui-button @click="rotate(-90)">Rotate Left</sui-button>
                <sui-button @click="rotate(90)">Rotate Right</sui-button>
              </sui-button-group>
          <sui-button positive  @click="crop()">
            OK
          </sui-button>
          <sui-button positive @click.native="toggle">
            Cancel
          </sui-button>
        </sui-modal-actions>
      </sui-modal>
  </div>
</template>

<script>
  import Error from '@/components/Alerts/Error'
  import UserSettingsMenu from '@/components/User/Settings/UserSettingsMenu'

  export default {
    name: 'UserProfileSettings',
    components: {
      Error,
      UserSettingsMenu
    },
    mounted() {
        // Upon mounting of the component, we accessed the .bind({...})
        // function to put an initial image on the canvas.
        /*this.$refs.croppieRef.bind({
            url: 'http://i.imgur.com/Fq2DMeH.jpg',
        })*/
    },
    data () {
      return {
        open: false,
        file:'',
        name: '',
        username: '',
        email: '',
        bio: '',
        location: '',
        websiteUrl: '',
        avatar:'',
        notification: {
          message: '',
          type: ''
        },
        cropped: null,
        images: [
            'http://i.imgur.com/fHNtPXX.jpg',
        ]
      }
    },
    beforeRouteEnter (to, from, next) {
      const token = localStorage.getItem('tweetr-token')

      return token ? next() : next('/login')
    },
    created () {
      this.fetchAuthenticatedUser()
    },
    methods: {
      toggle() {
        this.open = !this.open;
        this.open == true ? this.$refs.croppieRef.bind({
            url: this.images[0],
        }) : '';
      },
      fetchAuthenticatedUser () {
        const token = localStorage.getItem('tweetr-token')
        axios
          .get('account/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.name = response.data.data.name
            this.username = response.data.data.username
            this.email = response.data.data.email
            this.location = response.data.data.location
            this.bio = response.data.data.bio
            this.websiteUrl = response.data.data.website_url
            this.avatar = response.data.data.avatar
          })
      },
      updateProfile () {
        const token = localStorage.getItem('tweetr-token')

        axios
          .put(
            '/account/update_profile',
            {
              name: this.name,
              username: this.username,
              email: this.email,
              location: this.location,
              bio: this.bio,
              website_url: this.websiteUrl
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            // display success notification
            this.notification = Object.assign({}, this.notification, {
              message: response.data.message,
              type: 'success'
            })
          })
      },
      handleFileUpload () {
        this.file = this.$refs.file.files[0];
        const reader = new FileReader();
        reader.onload = e => this.$refs.croppieRef.bind({ url: e.target.result });
        reader.readAsDataURL(this.file);
      },
      bind() {
          // Randomize cat photos, nothing special here.
          //let url = this.images[Math.floor(Math.random() * 4)]

          // Just like what we did with .bind({...}) on 
          // the mounted() function above.
          //this.$refs.croppieRef.bind({
              //url: url,
          //});
      },
      // CALBACK USAGE
      crop() {
          // Here we are getting the result via callback function
          // and set the result to this.cropped which is being 
          // used to display the result above.
          let options = {
              format: 'jpeg', 
              circle: false
          }
          this.$refs.croppieRef.result(options, (output) => {
              this.cropped = output;
          });
          var self=this;
          const token = localStorage.getItem('tweetr-token');
          let formData = new FormData();
          formData.append('file', this.file);
          axios.post( '/account/update_avatar',
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
              }
          ).then(function(data){
            if (data.statusText == "OK") {
              self.toggle()
            }
          })
      },
      result(output) {
          this.cropped = output;
      },
      update(val) {
          console.log(val);
      },
      rotate(rotationAngle) {
          // Rotates the image
          this.$refs.croppieRef.rotate(rotationAngle);
      }
    }
  }
</script>
