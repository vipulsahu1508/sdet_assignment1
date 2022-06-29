/// <reference types="cypress"/>

describe('SDET Assignment UI Aurtomation',()=>{

    beforeEach('Launch App',()=>{
        cy.visit('/index.php')
    })

    it('Validate whether the search suggestion is not given to the user until 3 characters are populated',()=>{

        cy.intercept({
            method: 'GET',
            url: 'http://automationpractice.com/**',
            query: {
                controller: 'search'
            }
        }).as('searchBar')

        function generateText(){
            var typedText=""
            const text=["d","r","e","s","s"]
            
            for(let i=0;i<text.length;i++){
                typedText=text.join("")
            }
            cy.get('#search_query_top').type(typedText)
        
            cy.wait('@searchBar')

            cy.get('@searchBar').then(sbr=>{
                console.log(sbr)
                if(typedText.length>=3){
                    cy.get('.ac_results')
                }
            })
        }
        generateText()

    })

    it('Validate results are displayed according to the search made by the user',()=>{
        
        const searchResult=["Printed Summer Dress","Printed Dress","Printed Summer Dress","Printed Chiffon Dress","Printed Dress","Faded Short Sleeve T-shirts","Blouse"]

        cy.get('#search_query_top').type('dress')
        cy.get('[name="submit_search"]').click()
        cy.get('.right-block a.product-name').each(($ele,i) => {
            cy.wrap($ele).invoke('text').should('contain', searchResult[i])
        })
        
    })

    it('Validate whether the user is able to apply the large size catalog filter for the T-shirt section',()=>{

        cy.intercept({
            method: 'GET',
            url: '**/modules/blocklayered/**',     
        }).as('largeFilter')
        
        cy.get('#block_top_menu ul li a').contains('T-shirts').click({force:true})
        cy.get('.layered_filter ul li').contains('L').click()
        cy.wait('@largeFilter')

        cy.get('#enabled_filters span').should('contain','Enabled filters:')
        cy.get('#enabled_filters ul').should('contain','Size: L')
    })

    it('Validate whether the user is able to upload  a file on the contact us page',()=>{

        cy.get('#contact-link').contains('Contact us').click()
        
        cy.get('input[type="file"]').attachFile('igg-report.pdf')
        //cy.get('input[type="file"]').selectFile('igg-report.pdf')
        cy.get('#uniform-fileUpload span').should('contain','igg-report.pdf')
    })

    it.only('Add 5 products in the cart, validate total cart amount and individual product price both with and without discount',()=>{
        let totalAmount=0
        cy.get('#block_top_menu ul li a').contains('Dresses').click({force:true})

        cy.get('div.product-container').each(($ele)=>{
            cy.wrap($ele).trigger('mouseover').within(() => {
                cy.contains('Add to cart').should('be.visible').click()
            })
            cy.get('.continue > span', {timeout: 10000}).should('be.visible').click();
        })
       
        cy.get('.shopping_cart a b').click()

        
        cy.get('tbody tr .cart_total span').each(($ele)=>{
            const indAmount=parseFloat($ele.text().trim().slice(1))
            totalAmount+=+indAmount
            cy.log(totalAmount)
        })
        cy.get('.cart_total_price > #total_product').then(($ele)=>{
            const totalBill=$ele.text().trim().slice(1)
            cy.log(totalBill)
            expect(totalAmount.toFixed(2)).to.equal(totalBill)
        })
        
    })
})