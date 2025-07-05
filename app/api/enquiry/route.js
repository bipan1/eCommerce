import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'

// POST - Create new enquiry
export async function POST(request) {
    try {
        const { fullName, email, phoneNumber, message } = await request.json();

        // Validate required fields
        if (!fullName || !email || !phoneNumber || !message) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create enquiry in database
        const enquiry = await prisma.enquiry.create({
            data: {
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                phoneNumber: phoneNumber.trim(),
                message: message.trim(),
            },
        });

        return NextResponse.json(
            { 
                message: 'Enquiry submitted successfully',
                enquiry: {
                    id: enquiry.id,
                    fullName: enquiry.fullName,
                    email: enquiry.email,
                    createdAt: enquiry.createdAt
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating enquiry:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Retrieve all enquiries (Admin only)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated and is admin
        if (!session || !session.user || !session.user.isAdmin) {
            return NextResponse.json(
                { message: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        // Get all enquiries ordered by creation date (newest first)
        const enquiries = await prisma.enquiry.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(
            { 
                enquiries,
                total: enquiries.length
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete enquiry by ID (Admin only)
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated and is admin
        if (!session || !session.user || !session.user.isAdmin) {
            return NextResponse.json(
                { message: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const enquiryId = searchParams.get('id');

        if (!enquiryId) {
            return NextResponse.json(
                { message: 'Enquiry ID is required' },
                { status: 400 }
            );
        }

        // Check if enquiry exists
        const existingEnquiry = await prisma.enquiry.findUnique({
            where: { id: parseInt(enquiryId) }
        });

        if (!existingEnquiry) {
            return NextResponse.json(
                { message: 'Enquiry not found' },
                { status: 404 }
            );
        }

        // Delete enquiry
        await prisma.enquiry.delete({
            where: { id: parseInt(enquiryId) }
        });

        return NextResponse.json(
            { message: 'Enquiry deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting enquiry:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 