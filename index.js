import PogObject from "../PogData/index"

const data = new PogObject("SBEChat", {
    firstInstall: true,
    hypixel: false,
    chat: '',
    sbeChat: false,
}, "data.json")

const chats = {
    'ALL': 'A',
    'PARTY': 'P',
    'GUILD': 'G',
    'OFFICER': 'O',
    'SKYBLOCK-COOP': ['SKYBLOCK','COOP']
}

const ALREADY_MESSAGE = "&cYou're already in this channel!&r"
const chatRegex = /\/chat (.+)\b/

register("messageSent", (m, e) => {
    if (!data.hypixel) return
    const msg = m.toLocaleLowerCase()

    if (!msg.startsWith('/') && data.sbeChat) {
        cancel(e)
        ChatLib.command(`sbechat ${m}`, true)
    }

    else if (msg.startsWith('/chat')) {
        if (msg.startsWith('/chat sbe')) {
            cancel(e)

            if (!data.sbeChat) {
                ChatLib.chat('§aYou are now in the §r§6SBE§r§a channel§r')
                data.sbeChat = true
                data.save()
            }

            else if (data.sbeChat) ChatLib.chat(ALREADY_MESSAGE)
        }
        
        else {
            if (chatRegex.test(msg)) {
                let prompt = msg.match(chatRegex)[1].toLocaleUpperCase()
                Object.entries(chats).forEach(([key, value]) => {

                    if (prompt === key || value.includes(prompt)) {
                        if (data.sbeChat && data.chat === key) {
                            ChatLib.chat(`&aYou are now in the &r&6${key}&r&a channel&r`)
                        }
                        else if (data.chat === key) {
                            ChatLib.chat(`${ALREADY_MESSAGE}`)
                        }
                        data.sbeChat = false
                        data.save()
                        return
                    }
                })
            
            }
        }
    }
})

register("chat", (chat) => {
    if (!data.hypixel) return
    data.chat = chat.toLocaleUpperCase()
    data.save()
}).setCriteria('&aYou are now in the &r&6${chat}&r&a channel&r')
// https://regex101.com/r/3djezK/1

register("chat", (e) => {
    cancel(e)
}).setCriteria(ALREADY_MESSAGE)

function hypixelTest() {
    data.hypixel = /.*.?hypixel.net.?/i.test(Server.getIP())
    data.save()
    //ChatLib.chat(`${Server.getIP()}: ${data.hypixel}`)
}
register("serverConnect", hypixelTest)
register("worldLoad", hypixelTest)

let firstInstall = register("step", () => {

    if (data.firstInstall) {
        if (data.hypixel) {
            data.chat = 'ALL'
            data.save()
            ChatLib.say("/chat a")
            ChatLib.chat('&aYou are now in the &r&6ALL&r&a channel&r')
            ChatLib.chat("&aInitialised &cSB&7E&cChat&r!\nThis module is made for &7SB&cE &rusers using the &6/sbechat &rfeature.\nUse &6/chat sbe &rto toggle the chat on.")
            data.firstInstall = false
            data.save()
        } else {
            ChatLib.chat("&aYou've imported &cSB&fE&cChat&a! &rJoin 'hypixel.net' to complete setup.\nOr &c/ct delete SBEChat&r.")
        }
    }
    else firstInstall.unregister()
}).setDelay(5)

