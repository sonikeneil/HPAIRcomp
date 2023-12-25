import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getCategory } from '../utils/categories';
import EntryModal from './EntryModal';
import React, { useState } from 'react';

// Table component that displays entries on home screen

export default function BasicTable({ entries }) {
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('original'); // 'original' or 'alphabetical'

  const toggleFavorite = (entryId) => {
    if (favorites.includes(entryId)) {
      // Remove from favorites
      setFavorites(favorites.filter((id) => id !== entryId));
    } else {
      // Add to favorites
      setFavorites([...favorites, entryId]);
    }
  };

  const headerStyle = {
    backgroundColor: '#81baf1', // Change this color to your desired header color
  };

  const rowStyle = (entryId) => ({
    backgroundColor: favorites.includes(entryId) ? 'lightyellow' : 'white',
  });

  const handleSortBy = () => {
    setSortBy(sortBy === 'original' ? 'alphabetical' : 'original');
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (sortBy === 'alphabetical') {
      // Sort alphabetically
      return nameA.localeCompare(nameB);
    } else {
      // Maintain the original order
      return 0;
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={headerStyle}>
            <TableCell onClick={handleSortBy}>Name</TableCell>
            <TableCell onClick={handleSortBy} align="right">Email</TableCell>
            <TableCell onClick={handleSortBy} align="right">User</TableCell>
            <TableCell onClick={handleSortBy} align="right">Category</TableCell>
            <TableCell align="right">Open</TableCell>
            <TableCell align="right">Favorites</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow
              key={entry.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              style={rowStyle(entry.id)}
            >
              <TableCell component="th" scope="row">
                {entry.name}
              </TableCell>
              <TableCell align="right"><a href={`mailto:${entry.email}`}>{entry.email}</a></TableCell>
              <TableCell align="right">{entry.user}</TableCell>
              <TableCell align="right">{getCategory(entry.category).name}</TableCell>
              <TableCell sx={{ "padding-top": 0, "padding-bottom": 0 }} align="right">
                <EntryModal entry={entry} type="edit" />
              </TableCell>
              <td align="right">
                <button onClick={() => toggleFavorite(entry.id)}>
                  {favorites.includes(entry.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}