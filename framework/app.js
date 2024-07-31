exports.reagir = void 0;
async function reagir(dest, ovl, msg, emoji) {
    await ovl.sendMessage(dest, { react: { text: emoji, key: msg.key } });
}
exports.reagir = reagir;
