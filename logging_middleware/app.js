
'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField,
    Pagination,
    Badge
} from '@mui/material';

// Sample fallback data to ensure the app works out-of-the box
const INITIAL_NOTIFICATIONS = [
    { ID: "d146095a", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:51:30" },
    { ID: "b283218f", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
    { ID: "81589ada", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:51:06" },
    { ID: "0005513a", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:50:54" },
    { ID: "ea836726", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:42" },
    { ID: "003cb427", Type: "Result", Message: "external", Timestamp: "2026-04-22 17:50:30" },
    { ID: "e5c4ff20", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:18" },
    { ID: "1cfce5ee", Type: "Event", Message: "tech-fest", Timestamp: "2026-04-22 17:50:06" },
    { ID: "cf2885a6", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:49:54" },
];

export default function NotificationDashboard() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [filteredNotifications, setFilteredNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [typeFilter, setTypeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    // View tracking state
    const [viewedNotifications, setViewedNotifications] = useState(new Set());

    useEffect(() => {
        let result = notifications;

        // Apply type filter
        if (typeFilter !== 'All') {
            result = result.filter(n => n.Type === typeFilter);
        }

        // Apply search filter
        if (searchQuery) {
            result = result.filter(n =>
                n.Message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.Type.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredNotifications(result);
        setPage(1); // Reset to first page when filters change
    }, [typeFilter, searchQuery, notifications]);

    // Pagination logic
    const count = Math.ceil(filteredNotifications.length / itemsPerPage);
    const paginatedData = filteredNotifications.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleMarkAsRead = (id) => {
        setViewedNotifications(prev => new Set(prev).add(id));
    };

    const getChipColor = (type) => {
        switch (type) {
            case 'Placement': return 'success';
            case 'Result': return 'error';
            case 'Event': return 'primary';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            {/* Header section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                    Campus Notifications Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Running on http://localhost:3000
                </Typography>
            </Box>

            {/* Controls / Filter row */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Search Notifications"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Filter by Type</InputLabel>
                        <Select
                            value={typeFilter}
                            label="Filter by Type"
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <MenuItem value="All">All Notifications</MenuItem>
                            <MenuItem value="Placement">Placement</MenuItem>
                            <MenuItem value="Result">Result</MenuItem>
                            <MenuItem value="Event">Event</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Main Content Table UI */}
            <TableContainer component={Paper} elevation={2} sx={{ mb: 4 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>Type</b></TableCell>
                            <TableCell><b>Message</b></TableCell>
                            <TableCell><b>Timestamp</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow 
                                key={row.ID}
                                sx={{ 
                                    backgroundColor: viewedNotifications.has(row.ID) ? 'action.hover' : 'inherit',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <TableCell>{row.ID}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.Type} 
                                        color={getChipColor(row.Type)} 
                                        size="small" 
                                        variant="outlined" 
                                    />
                                </TableCell>
                                <TableCell>{row.Message}</TableCell>
                                <TableCell>{row.Timestamp}</TableCell>
                                <TableCell>
                                    {!viewedNotifications.has(row.ID) ? (
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleMarkAsRead(row.ID)}
                                        >
                                            View
                                        </Button>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            Read
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No notifications found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Box */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                    count={count} 
                    page={page} 
                    onChange={(e, value) => setPage(value)} 
                    color="primary" 
                    showFirstButton 
                    showLastButton 
                />
            </Box>
        </Container>
    );
}
