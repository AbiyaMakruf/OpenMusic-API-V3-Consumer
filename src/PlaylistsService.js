const {Pool} = require('pg');

class PlaylistsService{
    constructor(){
        this._pool = new Pool();
    }

    async getPlaylist(playlistId){
        const queryPlaylist = {
        text: `SELECT playlists.id, playlists.name, users.username 
                FROM playlists
                LEFT JOIN users ON users.id = playlists.owner
                WHERE playlists.id = $1`,
        values: [playlistId],
        };
    
        const resultPlaylist = await this._pool.query(queryPlaylist);
        const playlists = resultPlaylist.rows[0];
    
        const querySongs = {
        text: `SELECT songs.id, songs.title, songs.performer 
                FROM songs 
                LEFT JOIN playlists_songs ON playlists_songs.song_id = songs.id
                WHERE playlists_songs.playlist_id = $1`,
        values: [playlistId],
        };
    
        const resultSongs = await this._pool.query(querySongs);
        const songs = resultSongs.rows;
    
        playlists.songs = songs;
    
        return playlists;
    }
}

module.exports = PlaylistsService;