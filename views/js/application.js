var app = new Vue({
  el: '#app',
  data: {
    dataList: [],
    socket: null,
    name: '',
    cellphone: ''
  },
  methods: {
  	getData: function() {
  		axios.post('/getData')
			  .then(response => (this.dataList = response.data))
			  .catch(function (error) {
			    console.log(error)
			  })
		},
		appendRow: function() {
			if (!this.formValid()) {
				return
			}
			const data = {
				'name': this.name,
				'cellphone': this.cellphone
			}
			this.socket.emit('appendRow', data);
			this.clearForm()
		},
		formValid: function() {
			return this.name != null && this.name != '' &&
				this.cellphone != null && this.cellphone != ''
		},
		clearForm: function() {
			this.name = ''
			this.cellphone = ''
		}
  },
  mounted: function () {
	  this.getData()
	  this.socket = io()
	  const self = this
	  this.socket.on('emitData', function(data) {
	    self.dataList.push([data.name, data.cellphone])
	  });
	}
})