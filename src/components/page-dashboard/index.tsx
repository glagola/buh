import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

import ExportDB from './db-export';
import ImportDB from './db-import';

export default function Dashboard() {
    return (
        <>
            <AppBar
                position='sticky'
                sx={{ backgroundColor: '#fff' }}
            >
                <Container>
                    <Toolbar disableGutters>
                        <Typography
                            component={Link}
                            to='/'
                            sx={{ color: '#000' }}
                        >
                            <HomeIcon sx={{ mr: 1 }} />
                        </Typography>
                        <Stack
                            flexGrow={1}
                            direction='row'
                            justifyContent='space-between'
                        >
                            <Stack
                                direction='row'
                                gap={3}
                            >
                                <Button
                                    to='/'
                                    component={Link}
                                >
                                    Reports
                                </Button>

                                <Button
                                    to='/currencies'
                                    component={Link}
                                >
                                    Currencies
                                </Button>

                                <Button
                                    startIcon={<AddIcon />}
                                    variant='outlined'
                                    component={Link}
                                    to='/report'
                                >
                                    New Report
                                </Button>
                            </Stack>

                            <Stack
                                direction='row'
                                gap={3}
                            >
                                <ImportDB />
                                <ExportDB />
                            </Stack>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container sx={{ p: 3 }}>
                <Outlet />
            </Container>
        </>
    );
}
