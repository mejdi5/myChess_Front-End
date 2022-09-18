import React,{useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { getAuthUser } from '../../Redux/actions/userActions';
import { Spinner, Card } from 'react-bootstrap';
import { Axios } from '../../axios';
function Home() {

  const dispatch = useDispatch();
  const [datas, setDatas] = useState([])

  useEffect(() => 
    dispatch(getAuthUser())
  , []);

  useEffect(() => 
    Axios
      .get('https://api.chess.com/pub/leaderboards')
      .then(res => setDatas(res.data.tactics))
      .catch(error => console.log(error))
  , []);


return (
<div className="home">
  <h1 style={{color:'white'}}>Welcome to myChess application</h1>
  <img src='/images/board.jpeg' alt="" className='boardImg'/>
  <p className='introduction'>Chess is a board game played between two players. It is sometimes called Western chess or international chess to distinguish it from related games such as xiangqi and shogi. The current form of the game emerged in Southern Europe during the second half of the 15th century after evolving from chaturanga, a similar but much older game of Indian origin. Today, chess is one of the world's most popular games, played by millions of people worldwide.

Chess is an abstract strategy game and involves no hidden information. It is played on a square chessboard with 64 squares arranged in an eight-by-eight grid. At the start, each player (one controlling the white pieces, the other controlling the black pieces) controls sixteen pieces: one king, one queen, two rooks, two bishops, two knights, and eight pawns. The object of the game is to checkmate the opponent's king, whereby the king is under immediate attack (in "check") and there is no way for it to escape. There are also several ways a game can end in a draw.

Organized chess arose in the 19th century. Chess competition today is governed internationally by FIDE (International Chess Federation). The first universally recognized World Chess Champion, Wilhelm Steinitz, claimed his title in 1886; Magnus Carlsen is the current World Champion. A huge body of chess theory has developed since the game's inception. Aspects of art are found in chess composition; and chess in its turn influenced Western culture and art and has connections with other fields such as mathematics, computer science, and psychology.

One of the goals of early computer scientists was to create a chess-playing machine. In 1997, Deep Blue became the first computer to beat the reigning World Champion in a match when it defeated Garry Kasparov. Today's chess engines are significantly stronger than the best human players, and have deeply influenced the development of chess theory.</p>
  <div className='card_container'>
    {datas.length > 0
    ? datas?.map((data, index) =>
    <div className="cards" key={index}>
      <Card className="card">
        <div>
          <img 
          src={data?.avatar} 
          alt="" 
          className='card_picture'
          />
          <strong>{data?.username}</strong>
        </div>
        <div>
          <p>URL: <a href={data?.url}>{data?.url}</a></p>
          <p>Rank: {data.rank}</p>
          <p>Country: {data?.country?.slice(34)}</p>
        </div>
      </Card>
    </div>)
    :
    <><Spinner animation="border" role="status" className='spinner'/></>
    }
  </div>
</div>
  )
}

export default Home