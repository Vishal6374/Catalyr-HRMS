import { User } from './src/models';

async function testUpdate() {
    try {
        const user = await User.findOne();
        if (!user) {
            console.log("No user found");
            return;
        }
        console.log("Updating user:", user.id);
        // @ts-ignore
        user.pf_percentage = "";
        await user.save();
        console.log("SUCCESS: Update successful");
    } catch (error: any) {
        console.log("FAILED: Update failed");
        console.log("Error Name:", error.name);
        console.log("Error Message:", error.message);
    } finally {
        process.exit(0);
    }
}

testUpdate();
