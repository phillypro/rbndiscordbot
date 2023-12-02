

const guildId = global.guildId;
const roleId = global.roleId;

async function addRoleToUser(client, discordUserId) {
    try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) throw new Error('Guild not found');

        const role = guild.roles.cache.get(roleId);
        if (!role) throw new Error('Role not found');

        const member = await guild.members.fetch(discordUserId);
        await member.roles.add(role);
        console.log(`Role added to user ${discordUserId}`);
    } catch (error) {
        console.error('Error adding role to user:', error);
    }
}

async function removeRoleFromUser(client, discordUserId) {
    try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) throw new Error('Guild not found');

        const role = guild.roles.cache.get(roleId);
        if (!role) throw new Error('Role not found');

        const member = await guild.members.fetch(discordUserId);
        await member.roles.remove(role);
        console.log(`Role removed from user ${discordUserId}`);
    } catch (error) {
        console.error('Error removing role from user:', error);
    }
}

async function doesUserHaveRole(client, userId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(userId);
         
        // Check if the member has the role
        return member.roles.cache.has(roleId);
    } catch (error) {
        console.error('Error checking user role:', error);
        return false;
    }
}


module.exports = {
    addRoleToUser,
    removeRoleFromUser,
    doesUserHaveRole
};
