using AirBnB.Dtos;
using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public interface IApartmentRepository
    {
        Task<List<ApartmentToReturnDto>> GetAll();
        Task<ApartmentDetailDto> GetSpecific(string name);
        Task<bool> Add(ApartmentToAddDto dto); 
        Task<bool> UpdateApartment(ApartmentForUpdateDto dto);
        Task<bool> RemoveApartment(string name);
        Task<bool> Exist(string name);
        Task<bool> ChangeStatus(string name);

        Task<List<ApartmentToReturnDto>> Search(SearchDto dto);

        Task<bool> AddComment(CommentDto dto);
        Task<bool> ChangeCommentStatus(string name, int id);
    }
}
