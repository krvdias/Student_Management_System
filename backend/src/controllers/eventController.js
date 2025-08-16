const Events = require('../model/EventModel');
const { Op } = require('sequelize');

const eventController = {

    async addEvent(req, res) {
        try {
            const { title, coordinator, event_date } = req.body;

            if (!title || !event_date) {
                return res.status(400).json({ success: false, message: "Title and event date are required fields." });
            }

            // Create today's date at midnight UTC
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            // Parse the incoming event date as UTC
            const eventDate = new Date(event_date + "T00:00:00Z");
            if (isNaN(eventDate.getTime())) {
                return res.status(400).json({ success: false, message: "Invalid date format." });
            }

            if (eventDate <= today) {
                return res.status(400).json({ success: false, message: "Event date must be in the future." });
            }

            const event = await Events.create({
                title,
                coordinator,
                event_date: event_date // Use raw string or ensure DATEONLY type
            });

            res.status(201).json({
                success: true,
                message: "Event added successfully!",
                data: event
            });
        } catch (error) {
            console.error('Event adding error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    async getEvents(req, res) {
        try {
            const today = new Date();
            today.setHours(0,0,0,0);

            const upcomingEvents = await Events.findAll({
                where: {
                    event_date: {
                        [Op.gte]: today // Greater than or equal to today
                    }
                },
                order: [
                    ['event_date', 'ASC'] // Sort by date in ascending order (earliest first)
                ]
            });

            res.status(200).json({
                success: true,
                message: "Upcoming events retrieved successfully",
                data: upcomingEvents
            });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    async editEvent(req, res) {
        try {
            const { id } = req.params;
            const { title, coordinator, event_date } = req.body;

            // Check if the event exists
            const existingEvent = await Events.findByPk(id);
            if (!existingEvent) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Event not found with this id'
                });
            }

            let eventDate;
            if (event_date) {
                // Create today's date at midnight (to compare date-only)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Parse the incoming event date
                eventDate = new Date(event_date);
                if (isNaN(eventDate.getTime())) {
                    return res.status(400).json({ success: false, message: "Invalid date format." });
                }

                // Set time to midnight for comparison
                eventDate.setHours(0, 0, 0, 0);

                if (eventDate <= today) {
                    return res.status(400).json({ success: false, message: "Event date must be in the future." });
                }
            }

            // Prepare update object with only provided fields
            const updateData = {};
            if (title) updateData.title = title;
            if (coordinator) updateData.coordinator = coordinator;
            if (event_date) updateData.event_date = eventDate;

            // Check if at least one field is being updated
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: "No valid fields provided for update." });
            }

            // Perform the update
            const [affectedRows] = await Events.update(updateData, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ success: false, message: "There is no update anthything" });
            }

            // Fetch the updated event to return in response
            const updatedEvent = await Events.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Event updated successfully",
                data: updatedEvent
            });

        } catch (error) {
            console.error('Error updating event:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;

            // Check if the event exists
            const existingEvent = await Events.findByPk(id);
            if (!existingEvent) {
                return res.status(404).json({ success: false, message: `Event not found with id` });
            }

            await Events.destroy({ where: {id} });

            res.status(200).json({ success: true, message: "Event deleted successfully" });
        } catch (error) {
            console.error("Error deleting event:", error);
            res.status(500).json({ success: false, message: "Failed to delete event" });
        }
    }
}

module.exports = eventController;