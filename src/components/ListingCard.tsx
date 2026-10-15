import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Calendar } from 'lucide-react';
import { Listing } from '../types';
import { UserAvatar } from './UserAvatar';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const isService = listing.kind === 'service';

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-teal-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Author Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={listing.ownerName}
              avatarUrl={listing.ownerAvatarUrl}
              avatarInitial={listing.ownerAvatar}
              avatarColor={listing.ownerAvatarColor}
              size="xs"
              shape="circle"
            />
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-800 block truncate">
                {listing.ownerName}
              </span>
            </div>
          </div>

          {/* Badge */}
          {listing.isOwnerDue ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 shrink-0">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              Sinh viên DUE
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
              Cần tìm người
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 transition-colors line-clamp-2 mb-2">
          {listing.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {listing.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Delivery / Due */}
        <div className="flex items-center gap-1.5 text-slate-500">
          {isService ? (
            <>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Giao trong {listing.deliveryDays} ngày</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Hạn chót: {listing.dueAt ? new Date(listing.dueAt).toLocaleDateString('vi-VN') : 'Sớm'}</span>
            </>
          )}
        </div>

        {/* Price & Tag */}
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-normal">Thù lao</span>
          <span className="font-bold text-sm text-teal-700">
            {listing.price.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </Link>
  );
};
