const chai = require('chai'); 
const chaiHTTP = require('chai-http'); 

const {app, runServer, closeServer} = require('../server'); 

const expect = chai.expect; 

chai.use(chaiHTTP); 

describe('Blog Posts', function () {

	before(function() {
		return runServer(); 
	}); 

	after(function() {
		return closeServer(); 
	}); 

	it('should show blogs on GET', function () {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			expect(res).to.have.status(200); 
			expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body.length).to.be.at.least(1); 

			const expectedKeys = ['id', 'title', 'content', 'author']; 
			res.body.forEach(function(item) {
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectedKeys);
			}); 
		}); 
	});

	it ('should add item on POST', function () {
		const newItem = {title: 'Cars', content: 'Cars are fast and valuable', author: 'Harambe'};
		return chai.request(app)
		.post('/blog-posts')
		.send(newItem)
		.then(function(res) {
			expect(res).to.have.status(201); 
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('id', 'title', 'content', 'author'); 
			expect(res.body.id).to.not.equal(null); 
			expect(res.body.title).to.equal(newItem.title); 
			expect(res.body.content).to.equal(newItem.content)
			expect(res.body.author).to.equal(newItem.author)
		});
	}); 

	it('should update items on PUT', function() {
		const updateData = {
			title: 'fizz', 
			content: 'bar', 
			author: 'foo' 
		};

		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updateData.id = res.body[0].id; 

			return chai.request(app) 
			.put(`/blog-posts/${updateData.id}`)
			.send(updateData); 
		})

		then(function(res) {
			expect(res).to.have.status(200); 
			expect(res).to.be.json;
			expect(res.body).to.be.a('object'); 
			expect(res.body).to.deep.equal(updateData); 
		});
	});

	it('should delete items on Delete', function() {
		return chai.request(app)

		.get('/blog-posts')
		.then(function(res) {
			return chai.request(app)
				.delete(`/blog-posts/${res.body[0].id}`);
		})
		then(function(res) {
			expect(res).to.have.status(204); 
		}); 
	}); 
}); 