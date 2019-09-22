using AirBnB.Dtos;
using AirBnB.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Admin, UserToReturnDto>();
            CreateMap<Host, UserToReturnDto>();
            CreateMap<Guest, UserToReturnDto>();
            CreateMap<UserForRegistrationDto, User>();
            CreateMap<Apartment, ApartmentDetailDto>();
            CreateMap<Apartment, ApartmentToReturnDto>().ForMember(x => x.Host,opt => opt.MapFrom(c=>c.Host));
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<Amenitie, AmenitieDto>();
            CreateMap<Comment, CommentToReturnDto>().ForMember(x => x.Guest, opt => opt.MapFrom(s => s.Guest.Username));
            CreateMap<Reservation, ReservationToReturnDto>()
                .ForMember(x => x.Apartment, opt => opt.MapFrom(s => s.Apartment.Name))
                .ForMember(x => x.Host, opt => opt.MapFrom(s => s.Apartment.Host.Username))
                .ForMember(x => x.Guest, opt => opt.MapFrom(s => s.Guest.Username));
        }
    }
}
