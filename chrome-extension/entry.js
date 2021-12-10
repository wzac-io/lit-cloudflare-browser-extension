// 
// global variables:
// - window.videoId
// - window.litNetworkReady
//

//
// We are trying to find the video id under the label "Video ID"
// @param { String } tag - a tag could be a div for <div>, label for <label>
// @param { String } text - the text inside the tag eg. <label>this text</label>
// @returns { Object } the found element
//
function getElementByTagText(tag, text){
    var element;
    [...document.querySelectorAll(tag)]
       .filter(e => e.textContent.includes(text))
       .forEach(e => element = e);
    return element;
}

// 
// listen to the tabs Settings, Captions, Embed, JSON
// @params { Function } callback - a function to pass in when the "Embed" button is clicked
//
function onClickedEmbedTab(callback){
    var tabBtns = document.querySelectorAll('[role="tab"]');
    [...tabBtns].forEach((btn) => {

        const isEmbedBtn = btn.getAttribute('aria-controls') == 'embed';

        // ammend the tab text if it's the embed tab
        btn.innerText = isEmbedBtn ? 'Embed (Powered Up by 🔥 LitProtocol)' : btn.innerText;

        // when a tab is clicked
        btn.addEventListener('click', (e) => {

            var container = document.getElementsByClassName('lit-embed-container');

            // when is the embed tab
            if(isEmbedBtn){
                window.hidedEmbedContainer = false;
                if(container.length > 0){
                    container[0].style.display = 'unset';
                }
                callback();
                return;
            }

            // when other tabs
            window.hidedEmbedContainer = true;
            if(container.length > 0){
                container[0].style.display = 'none';
            }
        });

    });
}

//
// Add the Lit section into the DOM
// 
function setupLitEmbedContainerDom(){

    // -- prepare data
    const template = `
        <div id="btn-lit-gate-video">🔥 Token-gate this video </div>
        <pre id="lit-snippet"></pre>
        <label>Place the following script tags at the end of the body tag</label>
        <pre id="lit-js-snippet"></pre>
    `

    const scriptSrc = 'https://files-ruddy-ten.vercel.app/';

    // -- execute
    window.addedEmbedContainer = true;
    var tabPanel = document.querySelector('[role="tabpanel"]');

    var litEmbedContainer = document.createElement('div');
    litEmbedContainer.classList.add('lit-embed-container');
    litEmbedContainer.innerHTML = template;
    tabPanel.prepend(litEmbedContainer);

    // -- add listeners
    var btnGate = document.getElementById('btn-lit-gate-video');
    btnGate.addEventListener('click', (e) => {
        setAccessControlConditions();
    });

    // -- add js script tags to snippet
    document.getElementById('lit-js-snippet').innerText = `
<script onload="LitJsSdk.litJsSdkLoadedInALIT()" src="https://jscdn.litgateway.com/index.web.js"></script>
<script src="${scriptSrc}"></script>
    `
}

// 
// Inject the accessControlConditions modal tag after the <body> tag
//
function injectShareModalToBody(){
    var model = document.createElement('div');
    model.setAttribute('id', 'shareModal');
    document.body.prepend(model);
}

// ---------- Entry ----------
(async () => {
    console.log("🔥 Lit-Cloudflare Plugin 0.0.1");
    
    // connent to Lit Node Client
    var litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()
    window.litNodeClient = litNodeClient

    // listen when the network is fully connected:
    document.addEventListener('lit-ready', async function (e) {
        window.litNetworkReady = true;
        console.log('🔥 LIT network is ready');
    }, false);

    injectShareModalToBody();
    
    var videoLabelExist = setInterval(() => {
        var videoIdLabel = getElementByTagText('label', 'Video ID');
        let videoId;

        if(videoIdLabel != undefined){
            videoId = videoIdLabel.nextElementSibling.querySelector('pre').innerText;
        }

        if(videoIdLabel != undefined && videoId.length > 1){
            console.log("Found Video Label ID");
            window.videoId = videoId;
            console.log(window.videoId);
            onClickedEmbedTab(async () => {
                if(!window.addedEmbedContainer){
                    setupLitEmbedContainerDom();
                }
            });
            clearInterval(videoLabelExist);
        }
    }, 100);
})();