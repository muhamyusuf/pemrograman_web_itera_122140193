from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Matakuliah


@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk menampilkan daftar matakuliah"""
    dbsession = request.dbsession
    matakuliahs = dbsession.query(Matakuliah).all()
    return {'matakuliahs': [m.to_dict() for m in matakuliahs]}


@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu matakuliah"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    return {'matakuliah': matakuliah.to_dict()}


@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan matakuliah baru"""
    try:
        # Ambil data dari request JSON
        json_data = request.json_body
        
        # Validasi data minimal
        required_fields = ['kode_mk', 'nama_mk', 'sks', 'semester']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(
                    json_body={'error': f'Field {field} wajib diisi'}
                )
        
        # Validasi tipe data
        try:
            sks = int(json_data['sks'])
            semester = int(json_data['semester'])
        except ValueError:
            return HTTPBadRequest(
                json_body={'error': 'SKS dan semester harus berupa angka'}
            )
        
        # Buat objek Matakuliah baru
        matakuliah = Matakuliah(
            kode_mk=json_data['kode_mk'],
            nama_mk=json_data['nama_mk'],
            sks=sks,
            semester=semester
        )
        
        # Simpan ke database
        dbsession = request.dbsession
        dbsession.add(matakuliah)
        dbsession.flush()  # Untuk mendapatkan ID yang baru dibuat
        
        return {'success': True, 'matakuliah': matakuliah.to_dict()}
    
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    """View untuk mengupdate data matakuliah"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    
    # Cari matakuliah yang akan diupdate
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    try:
        # Ambil data dari request JSON
        json_data = request.json_body
        
        # Update atribut yang ada di request
        if 'kode_mk' in json_data:
            matakuliah.kode_mk = json_data['kode_mk']
        if 'nama_mk' in json_data:
            matakuliah.nama_mk = json_data['nama_mk']
        if 'sks' in json_data:
            try:
                matakuliah.sks = int(json_data['sks'])
            except ValueError:
                return HTTPBadRequest(
                    json_body={'error': 'SKS harus berupa angka'}
                )
        if 'semester' in json_data:
            try:
                matakuliah.semester = int(json_data['semester'])
            except ValueError:
                return HTTPBadRequest(
                    json_body={'error': 'Semester harus berupa angka'}
                )
        
        return {'success': True, 'matakuliah': matakuliah.to_dict()}
    
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus data matakuliah"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    
    # Cari matakuliah yang akan dihapus
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    # Hapus dari database
    dbsession.delete(matakuliah)
    
    return {
        'success': True,
        'message': f'Matakuliah dengan id {matakuliah_id} berhasil dihapus'
    }
