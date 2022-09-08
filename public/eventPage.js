
var contextMenuItem = {
    "id":"spendMoney",
    "title":"Add to ClickUp docs",
    "contexts":["selection"]
};

 chrome.contextMenus.create(contextMenuItem)

chrome.contextMenus.onClicked.addListener(function(clickData){
    if (clickData.menuItemId == "spendMoney" && clickData.selectionText){
        chrome.storage.sync.set({'text':clickData.selectionText})
    }
})

chrome.tabs.onUpdated.addListener(function(tabid, info, tab) {
    if(tab.url){
        let st = tab.url
        
        if(st.includes("dazzling-quokka-2f23ea.netlify.app")){
            let arr = tab.url?.split('code=')
            let code = arr[1]
            chrome.storage.sync.set({'code':code})
        }
        
    }
});