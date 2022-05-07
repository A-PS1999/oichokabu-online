import React from 'react';
import './RulesPage.scss';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

export default function RulesPage() {

    return (
        <>
            <Navbar />
                <header className="rules-header">
                    <h1>How to Play Oicho Kabu</h1>
                </header>
                <main>
                    <div className='rules-contents'>
                        <h1 className='rules-contents__title'>Contents</h1>
                        <a href="#objective" className='rules-contents__link'>Game Objective</a>
                        <a href="#cards" className='rules-contents__link'>Cards and Their Value</a>
                        <a href="#yaku" className='rules-contents__link'><em>Yaku </em> or Special Scoring Combinations</a>
                        <a href="#gameloop" className='rules-contents__link'>Flow of the Game</a>
                    </div>
                    <section className="section-objective" id="objective">
                        <h2 className='section-objective__title'>Game Objective</h2>
                        <p className="section-objective__text">
                            Like blackjack, oicho kabu is a game where players aim to beat the dealer, rather than each other.
                            Whereas in blackjack the ideal value of a hand of cards is 21, in oicho kabu players hope that their cards 
                            add up to 9. In general, to beat the dealer the value of a player's cards must be closer to 9 than the dealer's cards.
                        </p>
                    </section>
                    <section className="section-cards" id="cards">
                        <h1 className='section-cards__title'>Cards and Their Value</h1>
                        <p className="section-cards__text">
                            Oicho kabu is played with a deck of 40 cards, consisting of 4 cards for each number from 1 to 10. Suits don't matter in 
                            oicho kabu, so the game is typically played with a single-suit <em>kabufuda </em> deck.
                        </p>
                        <div className="section-cards__cardcalc">
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        7
                                    </div>
                                </div> 
                                <img src="/cards/card7.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <img src="/plus-sign.svg" alt="Plus sign" className="section-cards__cardcalc__plus" />
                            <div className="rules-card">
                            <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        5
                                    </div>
                                </div>
                                <img src="/cards/card5.jpg" alt="Oicho kabu card with value of 5" />
                            </div>
                            <img src="/equals-sign.svg" alt="Equals sign" className="section-cards__cardcalc__equals" />
                            <h1 className="section-cards__cardcalc__value">2</h1>
                        </div>
                        <p className="section-cards__text">
                            The value of a hand is calculated by adding up the value of each card. If the total value is a 2-digit number, then the 
                            hand is worth the second integer of the 2-digit number. Thus, two cards with individual values of 7 and 5 would add up to 12, 
                            resulting in a hand with a value of 2.
                        </p>
                    </section>
                    <section className="section-yaku" id="yaku">
                        <h1 className='section-yaku__title'><em>Yaku </em> or Special Scoring Combinations</h1>
                        <p className='section-yaku__text'>
                            <em>Yaku </em> are special combinations of cards which can allow the player to beat the dealer, even if the dealer's cards 
                            are closer to 9. These special combinations also grant the player extra chips on top of their bet, with the reward varying 
                            depending on the rarity of the <em>yaku </em> obtained.
                        </p>
                        <p className='section-yaku__text slight-margin'>In order of value (high to low), the yaku players can obtain in this game are:</p>
                        <ol className='section-yaku__list'>
                            <li className='section-yaku__list__item'>Arashi kabu</li>
                        </ol>
                        <div className="section-yaku__yaku-container">
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        3
                                    </div>
                                </div> 
                                <img src="/cards/card3.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        3
                                    </div>
                                </div> 
                                <img src="/cards/card3.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        3
                                    </div>
                                </div> 
                                <img src="/cards/card3.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                        </div>
                        <p className='section-yaku__text slight-margin'>
                            3 cards with a value of 3 add up precisely to 9 and all match, making this the most valuable <em>yaku. </em>
                            A player who achieves this <em>yaku </em> receives the value of their bet times 5.
                        </p>
                        <ol className='section-yaku__list--continued'>
                            <li className='section-yaku__list__item'>Arashi</li>
                        </ol>
                        <div className="section-yaku__yaku-container">
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        5
                                    </div>
                                </div> 
                                <img src="/cards/card5.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        5
                                    </div>
                                </div> 
                                <img src="/cards/card5.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        5
                                    </div>
                                </div> 
                                <img src="/cards/card5.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                        </div>
                        <p className="section-yaku__text slight-margin">
                            Any other set of 3 matching cards nets the player their bet times 3. Even if an <em>arashi </em> adds up to less than the 
                            dealer's cards, as long as the player has an <em>arashi </em> and the dealer doesn't, the player wins.
                        </p>
                        <ol className='section-yaku__list--continued'>
                            <li className='section-yaku__list__item'>Kudari</li>
                        </ol>
                        <div className="section-yaku__yaku-container">
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        8
                                    </div>
                                </div> 
                                <img src="/cards/card8.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        7
                                    </div>
                                </div> 
                                <img src="/cards/card7.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        6
                                    </div>
                                </div> 
                                <img src="/cards/card6.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                        </div>
                        <p className='section-yaku__text slight-margin'>
                            A descending series of 3 cards awards the player their bet times 2. The cards must be numerically adjacent (e.g. 8, 7, 6).
                        </p>
                        <ol className='section-yaku__list--continued'>
                            <li className='section-yaku__list__item'>Nobori</li>
                        </ol>
                        <div className="section-yaku__yaku-container">
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        3
                                    </div>
                                </div> 
                                <img src="/cards/card3.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        4
                                    </div>
                                </div> 
                                <img src="/cards/card4.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        5
                                    </div>
                                </div> 
                                <img src="/cards/card5.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                        </div>
                        <p className='section-yaku__text slight-margin'>
                            An ascending series of cards also results in a reward of one's bet times 2. Like the <em>kudari</em>, the cards must be 
                            numerically adjacent.
                        </p>
                        <ol className='section-yaku__list--continued'>
                            <li className='section-yaku__list__item'>Shippin</li>
                        </ol>
                        <div className="section-yaku__yaku-container--twocard">
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        4
                                    </div>
                                </div> 
                                <img src="/cards/card4.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                            <div className="rules-card">
                                <div className='rules-card__value-container'>
                                    <div className="rules-card__value-container__value">
                                        1
                                    </div>
                                </div> 
                                <img src="/cards/card1.jpg" alt="Oicho kabu card with value of 7" />
                            </div>
                        </div>
                        <p className='section-yaku__text slight-margin'>
                            Obtaining 2 cards with the values 4 and 1 in any order and choosing not to draw a third card gives the player their bet 
                            times 2.
                        </p>
                        <p className='section-yaku__text slight-margin'>
                            Oicho kabu is a game with many local rules and variations, and many more <em>yaku </em> exist in other versions of the game.
                        </p>
                    </section>
                    <section className='section-gameloop' id="gameloop">
                        <h1 className='section-gameloop__title'>Flow of the Game</h1>
                        <p className='section-gameloop__text slight-margin'>
                            The host of the game sets the number of rounds they would like to play, ranging from 6 to 24, when the game is created. 
                            The dealer is also able to set the max total bet per round when they create a new game room.
                        </p>
                        <img src="/pickdealerscreen.png" alt="Pick Dealer Screen" className='section-gameloop__img' />
                        <p className='section-gameloop__text slight-margin'>
                            When the game begins, players are prompted to turn over a card. The number of cards is equal to the number of players, and 
                            each player can only choose one. The player who turns over the card with the highest value becomes the first dealer of the game.
                        </p>
                        <p className='section-gameloop__text slight-margin'>
                            Once the dealer is chosen, players take turns choosing a card to bet on. A player may only bet on one card. The amount a 
                            player can bet is limited by the max total bet per round. If the host set the max bet to 500, it is not possible for a single 
                            player to bet above that amount. If a player bets 200 chips, the next player can bet up to 300 (totalling 500).
                        </p>
                        <p className='section-gameloop__text larger-margin'>
                            <b>
                                Please note: In a game with more than 2 players (excluding the dealer), it is possible for one player to bet the max amount
                                 for that round and thus bar other players from betting that round. This is also possible in the normal game, but is considered 
                                 rude. Players are encouraged not to bet the max possible amount.
                            </b>
                        </p>
                        <img src="/mainscreen.png" alt="Main Game Screen" className='section-gameloop__img' />
                        <p className='larger-margin'>
                            The value of a column of cards is displayed in the red circle beneath the cards.
                        </p>
                        <p className='section-gameloop__text larger-margin'>
                            Once all bets have been made, a second card is distributed to the column which a player bet on. If the value of the 2 cards is 
                            between 4 and 6, the player can choose to draw a third card. On the other hand, if a player's cards are worth 3 or less, a 
                            third card is automatically drawn. If the player's cards are worth 7 or more, a third card cannot be drawn.<br />
                            After all the player cards have been handled, the dealer's cards are also handled in the same way. 
                        </p>
                        <p className='section-gameloop__text larger-margin'>
                            Finally, scoring is handled, taking into account the value of players' cards and if they have a <em>yaku</em>. Besides the 
                            normal condition of winning if their cards are closer to 9 than the dealer's, players win if they have a <em>yaku </em>
                            and the dealer doesn't. 
                        </p>
                        <p className='section-gameloop__text larger-margin'>
                            After each round the max bet limit is reset and another player becomes the dealer, rotating clockwise.
                        </p>
                    </section>
                    <section className='section-end'>
                        <b className='section-end__text slight-margin'>Are you ready to try oicho kabu? Log in and play!</b>
                        <div className='section-end__button-container'>
                            <Link to="/log-in" className='section-end__button-container__link'>
                                Log in
                            </Link>
                            <button onClick={() => scrollToTop()} className="section-end__button-container__backbutton">Back to top</button>
                        </div>
                    </section>
                </main>
            <Footer />
        </>
    )
}