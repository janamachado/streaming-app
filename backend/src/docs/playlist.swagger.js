/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The playlist ID
 *         name:
 *           type: string
 *           description: The playlist name
 *         description:
 *           type: string
 *           description: The playlist description
 *         playlistSongs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlaylistSong'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     PlaylistSong:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The playlist song ID
 *         playlistId:
 *           type: integer
 *           description: The playlist ID
 *         songId:
 *           type: integer
 *           description: The song ID
 *         order:
 *           type: integer
 *           description: The order of the song in the playlist
 *         song:
 *           $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: Playlist management endpoints
 */

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The playlist name
 *               description:
 *                 type: string
 *                 description: The playlist description
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Invalid request or duplicate name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 *   get:
 *     summary: List all playlists
 *     tags: [Playlists]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter playlists by name
 *       - in: query
 *         name: songId
 *         schema:
 *           type: integer
 *         description: Filter playlists containing a specific song
 *     responses:
 *       200:
 *         description: List of playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 */

/**
 * @swagger
 * /api/playlists/search:
 *   get:
 *     summary: Search playlists by name or description
 *     tags: [Playlists]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for playlist name or description
 *     responses:
 *       200:
 *         description: List of playlists matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Search query is required
 */

/**
 * @swagger
 * /api/playlists/by-song:
 *   get:
 *     summary: Find playlists containing a specific song
 *     tags: [Playlists]
 *     parameters:
 *       - in: query
 *         name: song
 *         schema:
 *           type: string
 *         required: true
 *         description: Song ID or title to search for
 *     responses:
 *       200:
 *         description: List of playlists containing the song
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Song query is required
 */

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Get a playlist by ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 * 
 *   put:
 *     summary: Update a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The playlist name
 *               description:
 *                 type: string
 *                 description: The playlist description
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 *       400:
 *         description: Invalid request or duplicate name
 * 
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       204:
 *         description: Playlist deleted successfully
 *       404:
 *         description: Playlist not found
 */

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   post:
 *     summary: Add songs to a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songIds
 *             properties:
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of song IDs to add
 *     responses:
 *       200:
 *         description: Songs added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 *       400:
 *         description: Invalid request or duplicate songs
 * 
 *   delete:
 *     summary: Remove songs from a playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songIds
 *             properties:
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of song IDs to remove
 *     responses:
 *       200:
 *         description: Songs removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 *       400:
 *         description: Invalid request or songs not in playlist
 */
