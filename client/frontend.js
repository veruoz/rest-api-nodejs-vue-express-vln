import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'

Vue.component('loader', {
    template: `
    <div style="display: flex; justify-content: center; align-items: center;">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div> 
    </div>
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            loading: false,
            form:     {
                name:  '',
                value: ''
            },
            contacts: []
        }
    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods:  {
        async createContact() {
            const { ...contact } = this.form
            console.log(contact)

            const newContact = await request('/api/contacts', 'POST', contact)
            console.log(request)

            this.contacts.push(newContact)
            // this.contacts.push({ ...contact, id: Date.now(), marked: false })

            this.form.name = this.form.value = ''
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id)
            const updated = await request(`/api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: true
            })
            console.log(id)
            contact.marked = updated.marked
            // contact.marked = true
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE')
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
    },
    async mounted() {
        this.loading = true
        // * здесь вызываются асинхронные запросы на сервер
        console.log('Ready')
        const data = await request('/api/contacts')
        console.log(data)
        this.contacts = data
        this.loading = false
    }
})

async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return response.json()
    } catch (e) {
        console.warn('Error', e.message)
    }
}
