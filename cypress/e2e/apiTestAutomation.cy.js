/// <reference types="cypress"/>

describe('SDET Assignment API Aurtomation', () => {

    let token = ""
    let randomText = ""
    let testEmail = ""

    const pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 6; i++) {
        randomText += pattern.charAt(Math.floor(Math.random() * pattern.length));
        testEmail = randomText + '@gmail.com'
    }
    before('Create User', function () {

        cy.fixture('createUser').as('user')
        cy.then(() => {
            const body = {...this.user, "email": testEmail}
            cy.request({
                method: 'POST',
                url: 'https://thinking-tester-contact-list.herokuapp.com/users',
                body: body
            }).then(({ status, body }) => {
                token = body.token

                expect(status).to.eq(201)
                expect(body.user).has.property('firstName', this.user.firstName)
                expect(body.user).has.property('lastName', this.user.lastName)
                expect(body.user).has.property('email', testEmail.toLocaleLowerCase())
            })
        })

    })

    beforeEach(function () {
        cy.fixture('createUser').as('user')
        cy.fixture('contact').as('contact')
    })


    it('Validate firstname, last name and email fields returned by fetch user is same as provided while adding a user', function () {
        cy.request({
            method: 'GET',
            url: 'https://thinking-tester-contact-list.herokuapp.com/users/me',
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(function ({ status, body }) {
            expect(status).to.eq(200)
            expect(body).has.property('firstName', this.user.firstName)
            expect(body).has.property('lastName', this.user.lastName)
            expect(body).has.property('email', testEmail.toLocaleLowerCase())
        })
    })

    it('Validate user is not able to fetch user details with invalid token', () => {

        let randomText = ""
        let randomToken = ""

        var pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for (var i = 0; i < 10; i++) {
            randomText += pattern.charAt(Math.floor(Math.random() * pattern.length));
            randomToken = randomText
        }

        cy.request({
            method: 'GET',
            url: 'https://thinking-tester-contact-list.herokuapp.com/users/me',
            headers: {
                authorization: `Bearer ${randomToken}`
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401)
            expect(res.body).has.property('error', 'Please authenticate.')
        })


    })

    it('Validate the contact is added successfully using add contact api. Also, validate the response values for each field is correct.', function () {

        cy.request({
            method: 'POST',
            url: 'https://thinking-tester-contact-list.herokuapp.com/contacts',
            headers: {
                authorization: `Bearer ${token}`
            },
            body: this.contact
        }).then(({status,body}) => {
            expect(status).to.eq(201)
            expect(body).has.property('firstName', this.contact.firstName)
            expect(body).has.property('lastName', this.contact.lastName)
            expect(body).has.property('birthdate', this.contact.birthdate)
            expect(body).has.property('email', this.contact.email)
            expect(body).has.property('phone', this.contact.phone)
            expect(body).has.property('street1', this.contact.street1)
            expect(body).has.property('street2', this.contact.street2)
            expect(body).has.property('city', this.contact.city)
            expect(body).has.property('stateProvince', this.contact.stateProvince)
            expect(body).has.property('postalCode', this.contact.postalCode)
            expect(body).has.property('country', this.contact.country)
        })
    })

    it('Validate that no field has value as undefined or empty value.', function () {
        
        cy.request({
            method: 'POST',
            url: 'https://thinking-tester-contact-list.herokuapp.com/contacts',
            headers: {
                authorization: `Bearer ${token}`
            },
            body: this.contact
        }).then(({status,body}) => {
            expect(status).to.eq(201)
            expect(body.firstName).to.not.be.null
            expect(body.lastName).to.not.be.null
            expect(body.birthdate).to.not.be.null
            expect(body.email).to.not.be.null
            expect(body.phone).to.not.be.null
            expect(body.street1).to.not.be.null
            expect(body.street2).to.not.be.null
            expect(body.city).to.not.be.null
            expect(body.stateProvince).to.not.be.null
            expect(body.postalCode).to.not.be.null
            expect(body.country).to.not.be.null
        })
    })

    it('Validate the contact is deleted successfully using delete contact api. Also, validate get contact api returns error while fetching the deleted contact', function () {

        cy.request({
            method: 'POST',
            url: 'https://thinking-tester-contact-list.herokuapp.com/contacts',
            headers: {
                authorization: `Bearer ${token}`
            },
            body: this.contact
        }).then(({status,body}) => {
            const contactId = body._id
            expect(status).to.eq(201)

            cy.request({
                method: 'DELETE',
                url: 'https://thinking-tester-contact-list.herokuapp.com/contacts/' + contactId,
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(({status,body}) => {
                expect(status).to.eq(200)
                expect(body).to.contain('Contact deleted')

                cy.request({
                    method: 'GET',
                    url: 'https://thinking-tester-contact-list.herokuapp.com/contacts/' + contactId,
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                    failOnStatusCode: false
                }).then(({status,body}) => {
                    expect(status).to.eq(404)
                    expect(body).to.be.empty
                })
            })

        })

    })
})