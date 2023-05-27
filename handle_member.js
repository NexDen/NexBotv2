async function handle_member_add(member, debug){
    console.log(`[KATILIM] ${member.user.username}#${member.user.discriminator}`)
    // if (member.id === )
}

async function handle_member_leave(member, debug){
    console.log(`[ÇIKIŞ] ${member.user.username}#${member.user.discriminator}`)
}

module.exports = {handle_member_add , handle_member_leave}