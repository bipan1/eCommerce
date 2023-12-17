

export default function Profile() {
    return <div class="max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div class="flex items-center justify-center mb-6">
            <img src="profile-image.jpg" alt="Profile Picture" class="w-20 h-20 rounded-full border-2 border-blue-500" />
        </div>
        <div class="mb-4">
            <label for="username" class="block text-gray-700 font-semibold mb-2">Username</label>
            <input type="text" id="username" name="username" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your username" value="JohnDoe123" readonly />
        </div>
        <div class="mb-4">
            <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
            <input type="email" id="email" name="email" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your email" value="johndoe@example.com" readonly />
        </div>
        <div class="mb-4">
            <label for="address" class="block text-gray-700 font-semibold mb-2">Address</label>
            <textarea id="address" name="address" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your address" rows="3" readonly>123 Street, City, Country</textarea>
        </div>
        <div class="flex justify-end">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Edit Profile</button>
        </div>
    </div>
}
