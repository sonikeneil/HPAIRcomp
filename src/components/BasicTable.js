import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { getCategory } from '../utils/categories';
import EntryModal from './EntryModal';
import React, { useEffect, useState } from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import IconButton from '@mui/material/IconButton';
import { Box, TextField, Typography } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Table component that displays entries on the home screen

export default function BasicTable({ entries }) {
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState({ field: 'original', order: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedEntries, setSortedEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const toggleFavorite = (entryId) => {
    if (favorites.includes(entryId)) {
      setFavorites(favorites.filter((id) => id !== entryId));
    } else {
      setFavorites([...favorites, entryId]);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowStyle = (entryId) => ({
    backgroundColor: favorites.includes(entryId) ? 'lightyellow' : 'white',
  });

  const handleSortBy = (field) => {
    setSortBy((prevSortBy) => ({
      field,
      order: prevSortBy.field === field && prevSortBy.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (field) => {
    if (sortBy.field === field) {
      return sortBy.order === 'asc' ? <ExpandLessIcon /> : <ExpandMoreIcon />;
    }
    return null;
  };

  useEffect(() => {
    if (entries.length > 0 && sortBy.field !== 'original') {
      const sorted = [...entries].sort((a, b) => {
        const valueA = a[sortBy.field].toString().toLowerCase();
        const valueB = b[sortBy.field].toString().toLowerCase();

        if (sortBy.order === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      });

      setSortedEntries(sorted);
    } else if (entries.length > 0) {
      setSortedEntries(entries);
    }
  }, [sortBy, entries]);

  useEffect(() => {
    const filtered = sortedEntries.filter((entry) => {
      const name = entry.name.toLowerCase();
      const email = entry.email.toLowerCase();
      const searchTermLower = searchQuery.toLowerCase();

      return name.includes(searchTermLower) || email.includes(searchTermLower);
    });

    setFilteredEntries(filtered);
  }, [searchQuery, sortedEntries]);

  return (
    <Box>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          onChange={(e) => setSearchQuery(e.target.value)}
        />      
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#A41034' }}>
              <TableCell onClick={() => handleSortBy('name')} sx={{ color: 'white' }}>
                Name {getSortIcon('name')}
              </TableCell>
              <TableCell onClick={() => handleSortBy('email')} align="right" sx={{ color: 'white' }}>
                Email {getSortIcon('email')}
              </TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                User
              </TableCell>
              <TableCell onClick={() => handleSortBy('category')} align="right" sx={{ color: 'white' }}>
                Category {getSortIcon('category')}
              </TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                Favorites
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
            <TableRow
              key={entry.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              style={rowStyle(entry.id)}
            >
              <TableCell component="th" scope="row">
                <EntryModal entry={entry} type="edit" />
              </TableCell>
              <TableCell align="right">
                <a href={`mailto:${entry.email}`}>{entry.email}</a>
              </TableCell>
              <TableCell align="right">{entry.user}</TableCell>
              <TableCell align="right">{getCategory(entry.category).name}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => toggleFavorite(entry.id)}>
                  {favorites.includes(entry.id) ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredEntries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
