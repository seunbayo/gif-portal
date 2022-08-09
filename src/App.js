import { useEffect, useState } from 'react';

import twitterLogo from './assets/twitter-logo.svg';

import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://media.giphy.com/media/cXblnKXr2BQOaYnTni/giphy.gif',
  'https://media.giphy.com/media/jp7jSyjNNz2ansuOS8/giphy.gif',
  'https://media.giphy.com/media/IwAZ6dvvvaTtdI8SD5/giphy.gif',
  'https://media.giphy.com/media/BpGWitbFZflfSUYuZ9/giphy.gif',
  'https://media.giphy.com/media/MZocLC5dJprPTcrm65/giphy.gif',
  'https://media.giphy.com/media/dXFKDUolyLLi8gq6Cl/giphy.gif',
  'https://media.giphy.com/media/2RrKN8LIzvluQXOffg/giphy.gif',
  'https://media.giphy.com/media/BY8ORoRpnJDXeBNwxg/giphy.gif',
  'https://media.giphy.com/media/WsNbxuFkLi3IuGI9NU/giphy.gif',
  'https://media.giphy.com/media/hyyV7pnbE0FqLNBAzs/giphy.gif',
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { solana } = window;

        if (solana && solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });

          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
          return;
        }

        alert('Solana object not found! Get a Phantom Wallet 👻');
      } catch (error) {
        console.error(error);
      }
    };

    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList(state => [...state, inputValue]);
      setInputValue('');
      return;
    }
    console.log('Empty input. Try again.');
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    sendGif();
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />

        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>

      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">💼 The Office GIF Portal</p>
          <p className="sub-text">
            View your The Office GIF collection in the metaverse ✨
          </p>
          {!walletAddress
            ? renderNotConnectedContainer()
            : renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
