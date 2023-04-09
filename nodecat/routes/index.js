const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:4000'; // origin 헤더 추가
// 요청이 어디서 왔는지 확인하기 위해서

// 요청을 보내는 함수 - 토큰 만료시 자동으로 토큰 재발급 요청
const request = async (req, api) => {
    try {
        if(!req.session.jwt) { // 세션에 토큰이 없을 경우
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.FRONT_SECRET,
            });
            req.session.jwt = tokenResult.data.token; //세션에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt },
        }); // API 요청
    } catch (error) {
        if (error.response.status === 419) {//토큰 만료시 토큰 재발급
            delete req.session.jwt;
            return request(req, api);
        } // 419 이외 다른 에러
        return error.response;
    }
}
/*
router.get('/test', async (req, res, next) => {  //토큰 테스트 라우터
    try {
        if(!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET,
            });
            if(tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공
                req.session.jwt = tokenResult.data.token;
                console.log('토큰 발급 성공',req.session.jwt);
            } else { // 토큰 발급 실패
                return res.json(tokenResult.data); // 발급 실패 사유 응답
            }
        }
        // 발급 받은 토큰 테스트
        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: { authorization: req.session.jwt },
        });
        return res.json(result.data);
    } catch (error) {
        console.error(error);
        if ( error.response.status === 419) { // 토큰 만료시
            return res.json(error.response.data);
        }
        return next(error);
    }
});
*/
router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(
            // 주소에 한글이 포함될 경우 고려
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    } catch (error) {
        if (error.code) {
            console.error(error);
            next(error);
        }
        
    }
});

router.get('/followers/:id', async (req, res, next) => {
    try {
        const result = await request(
            req, `/followers/${encodeURIComponent(req.params.id)}`,
        );
        res.json(result.data);
    } catch (error) {
        if (error.code) {
            console.error(error);
            next(error);
        }
    };
});

router.get('/followings/:id', async (req, res, next) => {
    try {
        const result = await request(
            req, `/followings/${encodeURIComponent(req.params.id)}`,
        );
        res.json(result.data);
    } catch (error) {
        if (error.code) {
            console.error(error);
            next(error);
        }
    };
});

router.get('/', (req, res) => {
    // 프론트로 보내는 키는 client/front로 분리해서 구성
    res.render('main', { key: process.env.FRONT_SECRET});
});

module.exports = router;