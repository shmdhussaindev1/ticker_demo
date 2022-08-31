# Ticker Demo


**DEMO URL:** https://ticker-demo.vercel.app/


This is the demo project created for showing how can we use the ticker react component to move the items as in snabusiness.com latest news ticker.

This is NextJS Project, to run the project do

    + clone the repo
    + `npm i`
    + then do either 'npm run dev` or
    + `npm run build` followed by ` npm run start`
    + then open the url `http://localhost:3000` in the browser

This ticker component can be used as below, in this example it is used in `pages/index.js`

    `<Ticker refreshTimeInSec={30} tickerData={dummyData}></Ticker>`

Here
    refreshTimeInSec ==> after this much second , ticker's Data is refreshed through the function `dataRefresh` in `<Ticker>` component, \
    In that Function call the api and store the data in the variable `newTickerData` for example `let newTickerData = await fetchTickerData();`

    tickerData[Array of data items]==> initial ticker data, either you can pass or call the dataRefresh  in useEffect() for first time, better to pass the data when you are initializing the component

## Prerequisties

    + make sure page is having `direction:rtl` set for `html` and `body` elements

```css

    html,body {
        direction: rtl;
    }

```
    + all the elements have `box-sizing:border-box`

```css

    * {
        box-sizing: border-box;
    }

```

## Where to place your elements which are moving?

Place the elements to move in ticker in the file Ticker/index.js files, look for the comment block **/*START: this is the place u need to put ur ticker item*/**

and **/*END: this is the place u need to put ur ticker item*/** and place between the comment block.

In the example I placed the elements to move in the ticker (I used `<Link>` i.e `<a>` to move in the ticker)

```jsx

{tickerDataForScroller.contentItems.map((item) => {
    return (
        /*START: this is the place u need to put ur ticker item*/
        <Link key={item.id} href={item.url}>
            <a className={`${styles.item}`}>
                <span className={`${styles.text}`}>{item.headline}</span>
            </a>
        </Link>
        /*END: this is the place u need to put ur ticker item*/
    );
})}

```

## Files to include

`<Scroller>` and `<Ticker>` components folders including the scss/css files

I Used the play and Pause icon as svg that is the reason I used the "@svgr/webpack" pkg

I Used SCSS for compilation so i used sass pkg

Here instead of API call , I used dummyData/tickerData.json file

Other files are for demo purpose only, not required for projects

## Note:

comments are provided in the css and component js files
