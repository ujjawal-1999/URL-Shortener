const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const ShortUrl = require('./models/shortUrl');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urlShortener',{
	useNewUrlParser: true, useUnifiedTopology:true
});

app.set('view engine','ejs');
app.use(express.urlencoded({ extended:false}));

//Admin Routes
app.post('/admin',async (req,res)=>{
	const email = req.body.email;
	const password = req.body.password;
	if(email === 'jainujjawal1999@gmail.com' && password === 'Ujjawal@1999')
		res.redirect('/adminDetails');
	else
		res.redirect('/adminPage');
});

app.get('/adminPage',(req,res)=>{
	res.render('admin_login');
});

app.get('/adminDetails',async (req,res)=>{
	const shortUrls = await ShortUrl.find();
	res.render('admin',{shortUrls});
})

app.get('/adminDetails/delete/:shortUrl',async (req,res)=>{
	const shortUrl = req.params.shortUrl;
	await ShortUrl.findOneAndRemove({short:shortUrl}).then((data)=>{
		if(!data)
			res.status(404);
		else
			res.redirect('/adminDetails');
	}).catch((err)=>{
		res.send(400);
	});
});

app.get('/',async (req,res) => {
	const shortUrls = await ShortUrl.find();
	res.render('index',{shortUrls});
});

app.post('/shortUrls',async (req,res) => {
	await ShortUrl.create({full:req.body.fullUrl});
	res.redirect('/');
});

app.get('/:shortUrl',async (req,res)=>{
	const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});
	if(shortUrl == null)
		return res.sendStatus(404);
	shortUrl.clicks++;
	shortUrl.save().then(res=>console.log(res)).catch(err=>console.log(err));
	res.redirect(shortUrl.full);
})

app.listen(port,()=>{
	console.log('Server up and listening');
})